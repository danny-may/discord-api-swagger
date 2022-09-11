import { OpenAPIV3 } from "openapi-types";
import { IFileRegion } from "./File.js";
import { RegionSchemaReader } from "./RegionSchemaReader.js";


export class RequestResolver {
    readonly #regionReader: RegionSchemaReader;
    readonly #requests: Record<string, OpenAPIV3.RequestBodyObject>;

    public constructor(regionReader: RegionSchemaReader, requests: Record<string, OpenAPIV3.RequestBodyObject>) {
        this.#regionReader = regionReader;
        this.#requests = requests;
    }

    public apply(region: IFileRegion, operation: OpenAPIV3.OperationObject, method: OpenAPIV3.HttpMethods) {
        const queryParameters = operation.parameters ??= [];
        const unhandledRegions = new Set([...region.findChildren(/param/i)].map(r => r.region))
        const queryRegions = [...region.findChildren(/query string/i)];
        for (const region of queryRegions)
            unhandledRegions.delete(region.region);

        switch (queryRegions.length) {
            case 0: break;
            case 1: {
                const querySchema = this.#regionReader.read(queryRegions[0].region, '');
                queryParameters.push(...typeToParameters(querySchema.schema, 'query'));
                break;
            }
            default: throw new Error(`${region.id} - Multiple query parameter definitions found`);
        }

        // if (unhandledRegions.size > 0)
        //     console.warn(`${region.id} - unhandled param regions: ${JSON.stringify([...unhandledRegions].map(r => r.id))}`);
        return undefined!;
    }
}

const sharedKeys = ['description', 'deprecated', 'example'] as const;
function* typeToParameters(type: OpenAPIV3.SchemaObject, location: string): Iterable<OpenAPIV3.ParameterObject> {
    for (let [name, schema] of Object.entries(type.properties ?? {})) {
        let details: Pick<OpenAPIV3.SchemaObject, keyof OpenAPIV3.SchemaObject & keyof OpenAPIV3.ParameterObject> = {};
        if (!('$ref' in schema)) {
            if (schema.type === undefined && schema.allOf?.length === 1)
                [schema, details] = [schema.allOf[0], schema];
            else {
                [schema, details] = [omit(schema, sharedKeys) as typeof schema, pick(schema, sharedKeys)];
            }
        }

        yield {
            in: location,
            name,
            schema,
            description: details.description,
            deprecated: details.deprecated,
            example: details.example,
            required: type.required?.includes(name)
        }
    }
}
function pick<T extends object, Key extends string & keyof T>(instance: T, keys: readonly Key[]): Pick<T, Key>
function pick(instance: object, keys: readonly string[]): object {
    return Object.fromEntries(Object.entries(instance).filter(e => keys.includes(e[0])));
}
function omit<T extends object, Key extends string & keyof T>(instance: T, keys: readonly Key[]): Omit<T, Key>
function omit(instance: object, keys: readonly string[]): object {
    return Object.fromEntries(Object.entries(instance).filter(e => !keys.includes(e[0])));
}