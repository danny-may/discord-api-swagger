import { OpenAPIV3 } from "openapi-types";
import { DocumentationResolver } from "./DocumentationResolver.js";
import { IFileRegion } from "./File.js";
import { FileProvider } from "./FileProvider.js";
import { NotATypeError } from "./NotATypeError.js";
import { TableReader } from "./TableReader.js";
import { toPascalCase } from "./toPascalCase.js";
import { TypeReader } from "./TypeReader.js";

export class TypeResolver {
    readonly #files: FileProvider;
    readonly #schemas: Record<string, OpenAPIV3.SchemaObject>;
    readonly #documentation: DocumentationResolver;
    readonly #tableReader: TableReader;
    readonly #schemaCache: Map<IFileRegion, () => { id: string, schema: OpenAPIV3.SchemaObject }>;
    readonly #typeReader: TypeReader;

    public constructor(
        files: FileProvider,
        schemas: Record<string, OpenAPIV3.SchemaObject>,
        documentationResolver: DocumentationResolver,
        tableReader: TableReader) {
        this.#files = files;
        this.#schemas = schemas;
        this.#documentation = documentationResolver;
        this.#tableReader = tableReader;
        this.#typeReader = new TypeReader(this);
        this.#schemaCache = new Map();

        for (const block of getCommonTypes(this, documentationResolver))
            Object.assign(schemas, block)
    }

    public getSchema(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | string): OpenAPIV3.SchemaObject {
        if (typeof schema === 'string')
            return this.#getTypeDetails(schema).schema;

        if (!('$ref' in schema))
            return schema;

        const match = schema.$ref.match(/^#\/components\/schemas\/(?<id>[^\/]+)$/);
        if (match?.groups?.id === undefined || !(match.groups.id in this.#schemas))
            throw new Error(`Cannot resolve reference ${JSON.stringify(schema.$ref)}`);

        return this.#schemas[match.groups.id];
    }

    public setSchema(typeId: string | string[], schema: OpenAPIV3.SchemaObject): OpenAPIV3.ReferenceObject {
        typeId = typeof typeId === 'string' ? [typeId] : typeId;
        const realId = typeId.map(x => this.#toId(x)).join('');
        const current = this.#schemas[realId] ??= schema;
        if (JSON.stringify(current) !== JSON.stringify(schema))
            throw new Error(`Type ${JSON.stringify(realId)} is already set to a different value`);

        return { $ref: `#/components/schemas/${realId}` };
    }

    public getRef(typeId: string, field?: string): OpenAPIV3.ReferenceObject {
        const details = this.#getTypeDetails(typeId);

        const current = this.#schemas[details.id] ??= details.schema;
        if (current !== details.schema)
            throw new Error(`Duplicate type for id ${details.id}`);

        let ref = `#/components/schemas/${details.id}`
        if (field !== undefined)
            ref += `/properties/${field}`;

        return { $ref: ref };
    }

    #toId(id: string): string {
        return toPascalCase(id).replace(/(struct(ure)?|object|enum)$/i, '');
    }

    #getTypeDetails(typeId: string): { id: string, schema: OpenAPIV3.SchemaObject } {
        while (typeId in typeIdRemappings)
            typeId = typeIdRemappings[typeId];

        const realId = this.#toId(typeId);
        if (realId in this.#schemas)
            return { id: realId, schema: this.#schemas[realId] }
        if (typeId in this.#schemas)
            return { id: typeId, schema: this.#schemas[typeId] }

        const [fileId, fragment = ''] = typeId.split('/');
        const file = this.#files.getFile(fileId);
        const regions = [...file.getRegions(fragment)];
        if (regions.length !== 1)
            throw new NotATypeError('Ambiguious or unknown fragment ' + fragment);

        const region = regions[0];
        let result = this.#schemaCache.get(region);
        if (result === undefined) {
            const details = this.#computeTypeDetails(region);
            this.#schemaCache.set(region, result = details.result);
            if (!this.#schemaCache.has(details.region))
                this.#schemaCache.set(details.region, details.result);
        }

        return result();
    }

    #computeTypeDetails(region: IFileRegion): { region: IFileRegion, result: () => { id: string, schema: OpenAPIV3.SchemaObject } } {
        const match = this.#findTable(region);
        if (typeof match === 'function')
            return { region, result: () => { throw match(); } };

        region = match.region;
        const table = match.table;
        const id = this.#toId(region.name);
        let schema: OpenAPIV3.SchemaObject | undefined;
        const schemaGetter = () => {
            if (schema === undefined) {
                schema = {};
                Object.assign(schema, this.#tableReader.read(region, table, this.#typeReader));
                schema.externalDocs ??= {
                    url: this.#documentation.getDocumentationUri(`${region.file.id}/${region.fragments[0]}`)
                }
                if (schema.description !== undefined)
                    schema.description = this.#documentation.resolveMarkdownLinks(schema.description);
                for (const prop of Object.values(schema.properties ?? {}))
                    if (!('$ref' in prop) && prop.description !== undefined)
                        prop.description = this.#documentation.resolveMarkdownLinks(prop.description);

            }
            return schema;
        }
        return {
            region,
            result: () => ({
                id,
                get schema() {
                    return schemaGetter()
                }
            })
        };
    }

    #findTable(region: IFileRegion): { region: IFileRegion, table: string[][] } | (() => Error) {
        for (const searchRegion of getRegionsToSearch(region)) {
            const tables = [...findTables(searchRegion.content)];
            if (tables.length === 1)
                return {
                    region: searchRegion,
                    table: tables[0]
                        .map(row => row.split('|').slice(1, -1).map(cell => cell.trim()))
                        .filter(row => !row.every(cell => cell.startsWith('-')))
                };
        }

        return () => new NotATypeError(`Ambiguous or missing tables in region ${region.file.id}/${region.fragments[0]}`);
    }
}

const typeIdRemappings: Record<string, string> = {
    'DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up': 'DOCS_RESOURCES_APPLICATION/application-object',
    'DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-data': 'DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-application-command-data-structure',
    'DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object': 'ActionRowObject',
    'DOCS_TOPICS_PERMISSIONS': 'DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags'
}
const postfixReplacements = {
    '-object': '-structure'
}

function* getCommonTypes(self: TypeResolver, docs: DocumentationResolver): Generator<Record<string, OpenAPIV3.SchemaObject>> {
    yield {
        Snowflake: {
            type: 'string',
            format: 'uint64',
            externalDocs: {
                url: docs.getDocumentationUri('DOCS_REFERENCE/snowflakes')
            }
        },
        ISO8601DateTime: {
            type: 'string',
            format: 'date-time',
            externalDocs: {
                url: docs.getDocumentationUri('DOCS_REFERENCE/iso8601-datetime')
            }
        },
        DiscordUnauthorizedError: {
            type: 'object',
            allOf: [{ $ref: '#/components/schemas/DiscordApiError' }],
            properties: {
                code: { type: 'integer', enum: [401] }
            },
            externalDocs: {
                url: docs.getDocumentationUri('DOCS_TOPICS_OPCODES_AND_STATUS_CODES/http')
            }
        },
        DiscordForbiddenError: {
            type: 'object',
            allOf: [{ $ref: '#/components/schemas/DiscordApiError' }],
            properties: {
                code: { type: 'integer', enum: [403] }
            },
            externalDocs: {
                url: docs.getDocumentationUri('DOCS_TOPICS_OPCODES_AND_STATUS_CODES/http')
            }
        },
        DiscordNotFoundError: {
            type: 'object',
            allOf: [{ $ref: '#/components/schemas/DiscordApiError' }],
            properties: {
                code: { type: 'integer', enum: [404] }
            },
            externalDocs: {
                url: docs.getDocumentationUri('DOCS_TOPICS_OPCODES_AND_STATUS_CODES/http')
            }
        },
        DiscordRatelimitError: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                retry_after: { type: 'number' },
                global: { type: 'boolean' }
            },
            required: ['message', 'retry_after', 'global'],
            externalDocs: {
                url: docs.getDocumentationUri('DOCS_TOPICS_RATE_LIMITS/rate-limits')
            }
        },
        DiscordApiError: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                code: { type: 'number' },
                errors: { $ref: '#/components/schemas/DiscordErrorNode' }
            },
            required: ['message', 'code'],
            externalDocs: {
                url: docs.getDocumentationUri('DOCS_TOPICS_OPCODES_AND_STATUS_CODES/http')
            }
        },
        DiscordErrorDetails: {
            type: 'object',
            properties: {
                code: { type: 'string' },
                message: { type: 'string' },
            },
            additionalProperties: false,
            required: ['code', 'message'],
            externalDocs: {
                url: docs.getDocumentationUri('DOCS_REFERENCE/error-messages')
            }
        },
        DiscordErrorNode: {
            type: 'object',
            properties: {
                _errors: { $ref: '#/components/schemas/DiscordErrorDetails' }
            },
            additionalProperties: { $ref: '#/components/schemas/DiscordErrorNode' },
            externalDocs: {
                url: docs.getDocumentationUri('DOCS_REFERENCE/error-messages')
            }
        }
    };
    yield {
        ActionRow: {
            type: 'object',
            properties: {
                type: {
                    type: 'integer',
                    enum: [1]
                },
                components: {
                    type: 'array',
                    items: [
                        self.getRef('DOCS_INTERACTIONS_MESSAGE_COMPONENTS/button-object'),
                        self.getRef('DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object'),
                        self.getRef('DOCS_INTERACTIONS_MESSAGE_COMPONENTS/text-inputs-text-input-structure')
                    ]
                }
            }
        } as OpenAPIV3.SchemaObject
    }
};


function* getRegionsToSearch(root: IFileRegion): Iterable<IFileRegion> {
    yield root;
    for (const fragment of root.fragments) {
        for (const [postfix, replacement] of Object.entries(postfixReplacements)) {
            if (!fragment.endsWith(postfix))
                continue;

            const target = fragment.slice(0, -postfix.length) + replacement;
            yield* root.children.filter(c => c.fragments.includes(target));
        }
    }
}

function* findTables(content: string): Iterable<string[]> {
    const result: string[] = [];
    function* yieldTable() {
        if (result.length > 0)
            yield result.splice(0, result.length);
    }
    for (const line of content.split('\n').map(l => l.trim())) {
        if (!line.startsWith('|') || !line.endsWith('|'))
            yield* yieldTable();
        else
            result.push(line);
    }
    yield* yieldTable();
}