import { OpenAPIV3 } from "openapi-types";
import { IFileRegion } from "./File.js";
import { TypeResolver } from "./TypeResolver.js";


export class ResponseResolver {
    readonly #typeResolver: TypeResolver;
    readonly #responses: OpenAPIV3.ResponsesObject;

    public constructor(typeResolver: TypeResolver, responses: OpenAPIV3.ResponsesObject) {
        this.#typeResolver = typeResolver;
        this.#responses = responses;

        Object.assign(responses, commonResponses(typeResolver));
    }

    public resolve(content: IFileRegion): OpenAPIV3.ResponsesObject {
        return {
            401: { $ref: '#/components/responses/DiscordUnauthorizedError' },
            403: { $ref: '#/components/responses/DiscordForbiddenError' },
            404: { $ref: '#/components/responses/DiscordNotFoundError' },
            429: { $ref: '#/components/responses/DiscordRatelimitError' },
            500: { $ref: '#/components/responses/DiscordApiError' },
            502: { $ref: '#/components/responses/DiscordGatewayUnavailableError' }
        };
    }
}

const ratelimitHeaders: OpenAPIV3.ResponseObject['headers'] = {
    'X-RateLimit-Limit': { schema: { type: 'number' } },
    'X-RateLimit-Remaining': { schema: { type: 'number' } },
    'X-RateLimit-Reset': { schema: { type: 'number' } },
    'X-RateLimit-Reset-After': { schema: { type: 'number' } },
    'X-RateLimit-Bucket': { schema: { type: 'string' } }
};

const commonResponses: (typeResolver: TypeResolver) => OpenAPIV3.ResponsesObject = types => ({
    DiscordUnauthorizedError: {
        description: 'The Authorization header was missing or invalid',
        content: {
            'application/json': { schema: types.getRef('DiscordUnauthorizedError') }
        }
    },
    DiscordForbiddenError: {
        description: 'The Authorization token you passed did not have permission to the resource',
        content: {
            'application/json': { schema: types.getRef('DiscordForbiddenError') }
        },
        headers: { ...ratelimitHeaders }
    },
    DiscordNotFoundError: {
        description: 'The resource at the location specified doesn\'t exist',
        content: {
            'application/json': { schema: types.getRef('DiscordNotFoundError') }
        },
        headers: { ...ratelimitHeaders }
    },
    DiscordRatelimitError: {
        description: 'You are being rate limited',
        content: {
            'application/json': { schema: types.getRef('DiscordRatelimitError') }
        },
        headers: {
            ...ratelimitHeaders,
            'X-RateLimit-Global': { schema: { type: 'boolean' } },
            'X-RateLimit-Scope': { type: 'string', schema: { enum: ['user', 'global', 'shared'] } },
        }
    },
    DiscordGatewayUnavailableError: {
        description: 'The discord gateway is unavailable, try again in a bit'
    },
    DiscordApiError: {
        description: 'Generic discord error',
        content: {
            'application/json': { schema: types.getRef('DiscordApiError') }
        },
        headers: { ...ratelimitHeaders }
    }
});