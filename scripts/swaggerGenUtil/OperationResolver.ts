import { OpenAPIV3 } from "openapi-types";
import { DocumentationResolver } from "./DocumentationResolver.js";
import { File, IFileRegion } from "./File.js";
import { RequestResolver } from "./RequestResolver.js";
import { ResponseResolver } from "./ResponseResolver.js";
import { toCamelCase } from "./toCamelCase.js";
import { TypeResolver } from "./TypeResolver.js";

export class OperationResolver {
    readonly #typeResolver: TypeResolver;
    readonly #requestResolver: RequestResolver;
    readonly #responseResolver: ResponseResolver;
    readonly #documentationResolver: DocumentationResolver;

    public constructor(typeResolver: TypeResolver, requestResolver: RequestResolver, responseResolver: ResponseResolver, documentationResolver: DocumentationResolver) {
        this.#documentationResolver = documentationResolver;
        this.#typeResolver = typeResolver;
        this.#requestResolver = requestResolver;
        this.#responseResolver = responseResolver;
    }

    public resolve(paths: OpenAPIV3.PathsObject, file: File): OpenAPIV3.PathsObject {
        for (const { match, region } of file.getRegions(/^(?<name>.*?) % (?<methodStr>.*?) (?<route>\/.*?)$/)) {
            const { groups: { name, methodStr, route } = {} } = match;

            const method = toHttpMethod(methodStr);
            const realRoute = route.replaceAll(/\{(.*?)(?:#.*?)?\}/g, (_, name) => `{${toCamelCase(name)}}`);
            const target: OpenAPIV3.PathItemObject = paths[realRoute] ??= {
                parameters: [...route.matchAll(/(?<=\{)(?<name>.*?)(?:#(?<typeRef>.*?))?(?=\})/g)]
                    .map(match => {
                        const { groups: { name, typeRef = 'string' } = {} } = match;
                        return {
                            name: toCamelCase(name),
                            in: 'path',
                            required: true,
                            schema: this.#typeResolver.getRef(typeRef, name.split('.').slice(-1)[0]),
                            description: `[${name}](${this.#documentationResolver.getDocumentationUri(typeRef)})`
                        }
                    })
            };

            const operation = target[method] ??= { responses: {} };

            const tags = operation.tags ??= [];
            for (const tag of this.#getTags(file, method, route, region))
                if (!tags.includes(tag))
                    tags.push(tag);

            if (operation.summary === undefined)
                operation.summary = name;
            else
                operation.summary += ` or ${name}`;

            if (operation.operationId === undefined)
                operation.operationId = toCamelCase(name);
            else
                operation.operationId += `Or${toCamelCase(name)}`;

            operation.requestBody = this.#requestResolver.resolve(region); // TODO: Should merge not replace
            Object.assign(operation.responses, this.#responseResolver.resolve(region)); // TODO: Should merge not replace
            operation.description ??= '';
            operation.description += `\n- [${name}](${this.#documentationResolver.getDocumentationUri(`${file.id}/${name}`)})`;
            operation.description += `\n\n  ${region.content.split('\n').map(line => `  ${line}`).join('\n')}`;
            operation.description = operation.description.trim();
        }
        return paths;
    }

    * #getTags(file: File, method: OpenAPIV3.HttpMethods, route: string, content: IFileRegion): Generator<string> {
        yield file.name.replaceAll('_', ' ');
        method; route; content;
    }
}

function toHttpMethod(method: string): OpenAPIV3.HttpMethods {
    switch (method.toUpperCase()) {
        case 'GET': return OpenAPIV3.HttpMethods.GET;
        case 'PUT': return OpenAPIV3.HttpMethods.PUT;
        case 'POST': return OpenAPIV3.HttpMethods.POST;
        case 'DELETE': return OpenAPIV3.HttpMethods.DELETE;
        case 'OPTIONS': return OpenAPIV3.HttpMethods.OPTIONS;
        case 'HEAD': return OpenAPIV3.HttpMethods.HEAD;
        case 'PATCH': return OpenAPIV3.HttpMethods.PATCH;
        case 'TRACE': return OpenAPIV3.HttpMethods.TRACE;
        default: throw new Error('Unsupported HTTP method ' + method);
    }
}