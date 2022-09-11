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

    public getRef(typeId: string): OpenAPIV3.ReferenceObject {
        const details = this.#getTypeDetails(typeId);

        const current = this.#schemas[details.id] ??= details.schema;
        if (current !== details.schema)
            throw new Error(`Duplicate type for id ${details.id}`);

        return { $ref: `#/components/schemas/${details.id}` };
    }

    #toId(id: string): string {
        return toPascalCase(id).replace(/(struct(ure)?|object|enum)$/i, '');
    }

    #getTypeDetails(typeId: string): { id: string, schema: OpenAPIV3.SchemaObject } {
        while (typeId in typeIdRemappings)
            typeId = typeIdRemappings[typeId];

        if (typeId in typeOverrides) {
            const override = typeOverrides[typeId];
            return {
                id: override.id,
                schema: this.#schemas[override.id] ??= this.#ensureDocumentation(override.schema(this), typeId)
            };
        }

        const region = this.#files.getRegion(typeId);
        if (region === undefined)
            throw new NotATypeError('Unknown region ' + typeId);

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
                this.#ensureDocumentation(schema, region.id);
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

    #ensureDocumentation(schema: OpenAPIV3.SchemaObject, id: string): OpenAPIV3.SchemaObject {
        schema.externalDocs ??= {
            url: this.#documentation.getDocumentationUri(id)
        }
        if (schema.description !== undefined)
            schema.description = this.#documentation.resolveMarkdownLinks(schema.description);
        for (const prop of Object.values(schema.properties ?? {}))
            if (!('$ref' in prop) && prop.description !== undefined)
                prop.description = this.#documentation.resolveMarkdownLinks(prop.description);

        return schema;
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

        return () => new NotATypeError(`Ambiguous or missing tables in region ${region.id}`);
    }
}

const typeIdRemappings: Record<string, string> = {
    'DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up': 'DOCS_RESOURCES_APPLICATION/application-object',
    'DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-data': 'DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-application-command-data-structure',
    'DOCS_TOPICS_PERMISSIONS': 'DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags'
}
const postfixReplacements = {
    '-object': '-structure'
}

const typeOverrides: Record<string, { id: string, schema: (self: TypeResolver) => OpenAPIV3.SchemaObject }> = {
    ['DOCS_REFERENCE/snowflakes']: {
        id: 'Snowflake',
        schema: () => ({
            type: 'string',
            format: 'uint64'
        })
    },
    ['DOCS_REFERENCE/iso8601-datetime']: {
        id: 'ISO8601DateTime',
        schema: () => ({
            type: 'string',
            format: 'date-time'
        })
    },
    ['DOCS_REFERENCE/error-messages']: {
        id: 'DiscordApiError',
        schema: (self) => ({
            type: 'object',
            properties: {
                message: { type: 'string' },
                code: {
                    oneOf: [
                        self.getRef('DOCS_TOPICS_OPCODES_AND_STATUS_CODES/json-json-error-codes'),
                        { type: 'number' }
                    ]
                },
                errors: self.getRef('DOCS_REFERENCE/error-messages/errors')
            },
            required: ['message', 'code']
        })
    },
    ['DOCS_REFERENCE/error-messages/errors']: {
        id: 'DiscordErrorNode',
        schema: (self) => ({
            type: 'object',
            properties: {
                _errors: self.getRef('DOCS_REFERENCE/error-messages/errors/details')
            },
            additionalProperties: { $ref: '#/components/schemas/DiscordErrorNode' }
        })
    },
    ['DOCS_REFERENCE/error-messages/errors/details']: {
        id: 'DiscordErrorDetails',
        schema: () => ({
            type: 'object',
            properties: {
                code: { type: 'string' },
                message: { type: 'string' },
            },
            additionalProperties: false,
            required: ['code', 'message']
        })
    },
    ['DOCS_TOPICS_RATE_LIMITS/rate-limits']: {
        id: 'DiscordRatelimitError',
        schema: () => ({
            type: 'object',
            properties: {
                message: { type: 'string' },
                retry_after: { type: 'number' },
                global: { type: 'boolean' }
            },
            required: ['message', 'retry_after', 'global']
        })
    },
    ['DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object']: {
        id: 'ActionRow',
        schema: (self) => ({
            type: 'object',
            properties: {
                type: {
                    type: 'integer',
                    enum: [1]
                },
                components: {
                    type: 'array',
                    items: {
                        oneOf: [
                            self.getRef('DOCS_INTERACTIONS_MESSAGE_COMPONENTS/button-object'),
                            self.getRef('DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object'),
                            self.getRef('DOCS_INTERACTIONS_MESSAGE_COMPONENTS/text-inputs-text-input-structure')
                        ]
                    }
                }
            }
        })
    }
}

function* getRegionsToSearch(root: IFileRegion): Iterable<IFileRegion> {
    yield root;
    for (const [postfix, replacement] of Object.entries(postfixReplacements)) {
        const [fileId, fragment] = root.id.split('/');
        if (fragment === undefined || !fragment.endsWith(postfix))
            continue;

        const newFragment = fragment.slice(0, -postfix.length) + replacement;

        yield* root.children.filter(c => c.id === `${fileId}/${newFragment}` || c.id === `${fileId}/${fragment}-${newFragment}`)
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