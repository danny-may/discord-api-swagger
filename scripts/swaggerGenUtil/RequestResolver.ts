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

    public resolve(region: IFileRegion): OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject {
        for (const child of region.children)
            if (child.name.toLowerCase().includes('form'))
                console.log(`${region.id} Form paramters:\n${child.content}`);
        return undefined!;
    }
}

