import { OpenAPIV3 } from "openapi-types";
import { DocumentationResolver } from "./DocumentationResolver.js";
import { IFileRegion } from "./File.js";
import { FileProvider } from "./FileProvider.js";
import { NotATypeError } from "./NotATypeError.js";
import { RegionSchemaReader } from "./RegionSchemaReader.js";
import { toPascalCase } from "./toPascalCase.js";

export class TypeResolver {
    readonly #files: FileProvider;
    readonly #schemas: Record<string, OpenAPIV3.SchemaObject>;
    readonly #documentation: DocumentationResolver;
    readonly #regionTypeReader: RegionSchemaReader;
    readonly #schemaCache: Map<string, () => { id: string, schema: OpenAPIV3.SchemaObject }>;
    readonly #typeIdRemappings: Record<string, string>;

    public constructor(
        files: FileProvider,
        schemas: Record<string, OpenAPIV3.SchemaObject>,
        documentationResolver: DocumentationResolver,
        regionTypeReader: RegionSchemaReader,
        typeIdRemappings: Record<string, string>) {
        this.#files = files;
        this.#schemas = schemas;
        this.#documentation = documentationResolver;
        this.#regionTypeReader = regionTypeReader;
        this.#typeIdRemappings = typeIdRemappings;
        this.#schemaCache = new Map();
    }

    public getSchema(schema: string, typePrefix: string): OpenAPIV3.SchemaObject
    public getSchema(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): OpenAPIV3.SchemaObject
    public getSchema(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | string, typePrefix: string = ''): OpenAPIV3.SchemaObject {
        if (typeof schema === 'string')
            return this.#getTypeDetails(schema, typePrefix).schema;

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

    public getRef(typeId: string, typePrefix: string): OpenAPIV3.ReferenceObject {
        const details = this.#getTypeDetails(typeId, typePrefix);
        const id = `${this.#toId(typePrefix)}${details.id}`;

        const current = this.#schemas[id] ??= details.schema;
        if (current !== details.schema)
            throw new Error(`Duplicate type for id ${id}`);

        return { $ref: `#/components/schemas/${id}` };
    }

    #toId(id: string): string {
        return toPascalCase(id).replace(/(struct(ure)?|object|enum)$/i, '');
    }

    #getTypeDetails(typeId: string, typePrefix: string): { id: string, schema: OpenAPIV3.SchemaObject } {
        while (typeId in this.#typeIdRemappings)
            typeId = this.#typeIdRemappings[typeId];

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

        const id = `${region.id}|${typePrefix}`;
        let result = this.#schemaCache.get(id);
        if (result === undefined) {
            const details = this.#computeTypeDetails(region, typePrefix);
            this.#schemaCache.set(id, result = details.result);
            const detailsId = `${details.region.id}|${typePrefix}`
            if (!this.#schemaCache.has(detailsId))
                this.#schemaCache.set(detailsId, details.result);
        }

        return result();
    }

    #computeTypeDetails(region: IFileRegion, typePrefix: string): { region: IFileRegion, result: () => { id: string, schema: OpenAPIV3.SchemaObject } } {
        const id = this.#toId(region.name);
        let result: { region: IFileRegion, schema: OpenAPIV3.SchemaObject } | undefined;
        const getResult = () => {
            if (result !== undefined)
                return result;
            result = this.#regionTypeReader.read(region, typePrefix);
            this.#ensureDocumentation(result.schema, result.region.id);
            return result;
        }
        let schema: undefined | (() => OpenAPIV3.SchemaObject);
        return {
            get region() { return getResult().region },
            result: () => ({
                id,
                get schema() {
                    if (schema === undefined) {
                        const result: OpenAPIV3.SchemaObject = {};
                        schema = () => result;
                        try {
                            Object.assign(result, getResult().schema)
                        } catch (err) {
                            schema = () => { throw err; };
                        }
                    }
                    return schema();
                }
            })
        }
    }

    #ensureDocumentation(schema: OpenAPIV3.SchemaObject, id: string): OpenAPIV3.SchemaObject {
        schema.externalDocs ??= {
            url: this.#documentation.getDocumentationUri(id)
        }
        return schema;
    }

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
    ['DOCS_REFERENCE/image-data']: {
        id: 'ImageData',
        schema: () => ({
            type: 'string',
            description: 'This should be a valid data uri',
            example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
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
                        self.getRef('DOCS_TOPICS_OPCODES_AND_STATUS_CODES/json-json-error-codes', ''),
                        { type: 'number' }
                    ]
                },
                errors: self.getRef('DOCS_REFERENCE/error-messages/errors', '')
            },
            required: ['message', 'code']
        })
    },
    ['DOCS_REFERENCE/error-messages/errors']: {
        id: 'DiscordErrorNode',
        schema: (self) => ({
            type: 'object',
            properties: {
                _errors: self.getRef('DOCS_REFERENCE/error-messages/errors/details', '')
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
                            self.getRef('DOCS_INTERACTIONS_MESSAGE_COMPONENTS/button-object', ''),
                            self.getRef('DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object', ''),
                            self.getRef('DOCS_INTERACTIONS_MESSAGE_COMPONENTS/text-inputs-text-input-structure', '')
                        ]
                    }
                }
            }
        })
    }
}
