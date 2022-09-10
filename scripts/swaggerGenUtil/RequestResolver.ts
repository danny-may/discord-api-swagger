import { OpenAPIV3 } from "openapi-types";
import { IFileRegion } from "./File.js";
import { TypeResolver } from "./TypeResolver.js";


export class RequestResolver {
    readonly #typeResolver: TypeResolver;
    readonly #requests: Record<string, OpenAPIV3.RequestBodyObject>;

    public constructor(typeResolver: TypeResolver, requests: Record<string, OpenAPIV3.RequestBodyObject>) {
        this.#typeResolver = typeResolver;
        this.#requests = requests;
    }

    public resolve(content: IFileRegion): OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject {
        return undefined!;
    }
}

