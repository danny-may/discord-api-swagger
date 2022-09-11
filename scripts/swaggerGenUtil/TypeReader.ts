import { OpenAPIV3 } from "openapi-types";
import { IFileRegion } from "./File.js";
import { NotATypeError } from "./NotATypeError.js";
import { TypeResolver } from "./TypeResolver.js";

export class TypeReader {
    readonly #resolver: TypeResolver;

    public constructor(resolver: TypeResolver) {
        this.#resolver = resolver;
    }

    public readType(region: IFileRegion, fieldName: string, type: string, description: string): OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject {
        const context: ITypeParseContext = {
            region,
            fieldName,
            resolver: this.#resolver,
            description,
            parseType: t => this.#readType(t, context),
        }

        return this.#readType(type, context);
    }

    #readType(type: string, ctx: ITypeParseContext): OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject {
        type = type.replaceAll(/\\?\*/g, '').trim();
        if (type.startsWith('a '))
            type = type.slice(2);
        if (type.startsWith('one of '))
            type = type.slice(7);
        if (type.endsWith(') object'))
            type = type.slice(0, -7);
        if (type.endsWith(') objects'))
            type = type.slice(0, -8);

        for (const handler of typePatterns) {
            const match = type.match(handler.filter);
            if (match !== null)
                return handler.readType(match, ctx);
        }

        console.error(`Failed to parse type ${JSON.stringify(type)}`);
        return {}
    }
}


interface ITypeParseContext {
    readonly region: IFileRegion;
    readonly fieldName: string;
    readonly resolver: TypeResolver;
    readonly description: string;
    parseType(type: string): OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
}

interface ITypePattern {
    readonly filter: RegExp;
    readType(match: RegExpMatchArray, ctx: ITypeParseContext): OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
}

const typePatterns: ITypePattern[] = [
    {
        filter: /^\?(.*)$/,
        readType(match, context) {
            const baseType = context.parseType(match[1]);
            if ('$ref' in baseType)
                return { allOf: [baseType], nullable: true };
            return { ...baseType, nullable: true };
        }
    },
    {
        filter: /^int64|snowflake$/i,
        readType(_, ctx) {
            return ctx.resolver.getRef('DOCS_REFERENCE/snowflakes');
        }
    },
    {
        filter: /^iso8601 ?timestamp$/i,
        readType(_, ctx) {
            return ctx.resolver.getRef('DOCS_REFERENCE/iso8601-datetime');
        }
    },
    {
        filter: /^string$/i,
        readType(_, ctx) {
            return primitiveToEnum(['string'], ctx) ?? { type: 'string' };
        }
    },
    {
        filter: /^string \(can be null only in reaction emoji objects\)$/i,
        readType() {
            return { type: 'string', nullable: true };
        }
    },
    {
        filter: /^bool(ean)?$/i,
        readType() {
            return { type: 'boolean' };
        }
    },
    {
        filter: /^u?int(eger|32)?$/i,
        readType(_, ctx) {
            return primitiveToEnum(['integer', 'number'], ctx) ?? { type: 'integer' };
        }
    },
    {
        filter: /^double|float$/i,
        readType(_, ctx) {
            return primitiveToEnum(['integer', 'number'], ctx) ?? { type: 'number' };
        }
    },
    {
        filter: /^object$/i,
        readType() {
            return { type: 'object', additionalProperties: true };
        }
    },
    {
        filter: /^null$/i,
        readType() {
            return { type: 'object', enum: [null] };
        }
    },
    {
        filter: /^LobbyType$/,
        readType(_, ctx) {
            return ctx.resolver.getRef('DOCS_GAME_SDK_LOBBIES/data-models-lobbytype-enum');
        }
    },
    {
        filter: /^EntitlementType$/,
        readType(_, ctx) {
            return ctx.resolver.getRef('DOCS_GAME_SDK_STORE/data-models-entitlementtype-enum');
        }
    },
    {
        filter: /^SkuType$/,
        readType(_, ctx) {
            return ctx.resolver.getRef('DOCS_GAME_SDK_STORE/data-models-skutype-enum');
        }
    },
    {
        filter: /^SkuPrice$/,
        readType(_, ctx) {
            return ctx.resolver.getRef('DOCS_GAME_SDK_STORE/data-models-skuprice-struct');
        }
    },
    {
        filter: /^integer for `INTEGER` options, double for `NUMBER` options$/,
        readType() {
            return {
                type: 'number',
                description: 'integer for `INTEGER` options, double for `NUMBER` options'
            };
        }
    },
    {
        filter: /^(.*?) or (.*)$/i,
        readType(match, ctx) {
            return {
                oneOf: match.slice(1)
                    .flatMap(c => c.split(','))
                    .map(c => c.trim())
                    .filter(c => c.length > 0)
                    .map(c => ctx.parseType(c))
            };
        }
    },
    {
        filter: /^array of (.*?)(?:(?<=\)) string)?(?:s)?$/i,
        readType(match, ctx) {
            return {
                type: 'array',
                items: ctx.parseType(match[1])
            };
        }
    },
    {
        filter: /^map of snowflakes to (.*?)(?:s)?$/i,
        readType(match, ctx) {
            return {
                type: 'object',
                additionalProperties: ctx.parseType(match[1])
            };
        }
    },
    {
        filter: /^dictionary with keys (?:as|in) (.*)$/i,
        readType(match, ctx) {
            const baseType = ctx.resolver.getSchema(ctx.parseType(match[1]));
            if (baseType.enum === undefined)
                throw new Error('Expected an enum but got ' + baseType.type);

            return {
                type: 'object',
                properties: Object.fromEntries(baseType.enum.map(x => [x, { type: 'string' }]))
            }
        }
    },
    {
        filter: /^partial (.*)$/i,
        readType(match, ctx) {
            const baseType = ctx.resolver.getSchema(ctx.parseType(match[1]));
            const declaredProperties = Object.entries(baseType.properties ?? {});
            const declaredKeys = new Set(declaredProperties.map(p => p[0]));
            const filteredProps = new Set([...ctx.description.matchAll(/(?<name>[\w\[\]]+)/g)]
                .map(m => m.groups?.name)
                .filter((x): x is string => x !== undefined)
                .filter(x => declaredKeys.has(x)));

            const properties = filteredProps.size === 0
                ? declaredProperties
                : declaredProperties.filter(p => filteredProps.has(p[0]));

            const parentType = ctx.resolver.getSchema(ctx.region.id);
            let externDocs: OpenAPIV3.ExternalDocumentationObject | undefined;

            return ctx.resolver.setSchema([ctx.region.name, ctx.fieldName], {
                ...baseType,
                properties: Object.fromEntries(properties),
                required: undefined,
                get externalDocs() {
                    return externDocs ?? parentType.externalDocs
                },
                set externalDocs(value) {
                    externDocs = value;
                }
            });
        },
    },
    {
        filter: /^\[.*?\]\(#(.*?)\)$/,
        readType(match, ctx) {
            return ctx.resolver.getRef(match[1]);
        },
    },
    {
        filter: /^\[.*?\]\(#(.*?)\)(?: objects?)? ([\w\[\]]+)$/,
        readType(match, ctx) {
            const type = ctx.resolver.getSchema(match[1]);
            return { ...type.properties?.[match[2]] ?? {} };
        },
    }
]

function primitiveToEnum(types: OpenAPIV3.SchemaObject['type'][], ctx: ITypeParseContext): OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined {
    for (const match of ctx.description.matchAll(/\[.*?\]\(#(.*?)\)/g)) {
        try {
            const ref = ctx.resolver.getRef(match[1]);
            const type = ctx.resolver.getSchema(ref);
            if (ref.$ref.endsWith('Flags') && type.type !== 'array' && types.includes(type.type))
                return { type: type.type, format: type.format };
            if (types.includes(type.type) && type.enum !== undefined)
                return ref;
        } catch (err: unknown) {
            if (!(err instanceof NotATypeError))
                throw err;
        }
    }
    return undefined;
}