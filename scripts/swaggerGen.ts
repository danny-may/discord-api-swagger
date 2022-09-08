import * as fs from 'fs/promises';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import { OpenAPIV3 } from 'openapi-types';
import * as path from 'path';
import { fileURLToPath } from 'url';

const docsZipResponse = await fetch('https://github.com/discord/discord-api-docs/archive/refs/heads/main.zip');
if (docsZipResponse.status !== 200)
    throw new Error('Failed to download the docs repo');

const zip = new AdmZip(Buffer.from(await docsZipResponse.arrayBuffer()));
const files = new Map(zip.getEntries()
    .filter(e => !e.isDirectory && e.entryName.startsWith('discord-api-docs-main/docs/'))
    .map(e => [e.entryName.slice(27), e.getData().toString('utf-8')]));

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

function toCamelCase(text: string): string {
    return text.replaceAll(/(?:^|[_. -]+)(\w)/g, (m, c) => m.length === 1 ? c.toLowerCase() : c.toUpperCase());
}

function applyEndpoint(operation: OpenAPIV3.OperationObject, fileName: string, endpointName: string, details: string): void {
    const tags = operation.tags ??= [];
    const ensureTags = [];
    ensureTags.push(path.basename(fileName, '.md').replaceAll('_', ' '));
    for (const tag of ensureTags)
        if (!tags.includes(tag))
            tags.push(tag);

    operation.summary = endpointName;
    operation.operationId = toCamelCase(endpointName);
    const docsPath = fileName.toLowerCase().replace('.md', '').replaceAll('_', '-');
    const docsId = endpointName.toLowerCase().replaceAll(' ', '-').replaceAll(/[^\w-]/g, '');
    operation.externalDocs = {
        url: `https://discord.com/developers/docs/${docsPath}#${docsId}`
    }

    const tmp = sections[`${fileName} ${endpointName}`] ??= {};
    for (const match of details.matchAll(/(?<=###### |^)(?<heading>.*?)\n(?<content>[\s\S]*?)(?=\n##|$)/g)) {
        const { groups: { heading, content } = {} } = match
        tmp[heading] = content;
    }
}

const sections: Record<string, Record<string, string>> = {};

const commonHeaders: OpenAPIV3.ResponseObject['headers'] = {
    'X-RateLimit-Limit': { schema: { type: 'number' } },
    'X-RateLimit-Remaining': { schema: { type: 'number' } },
    'X-RateLimit-Reset': { schema: { type: 'number' } },
    'X-RateLimit-Reset-After': { schema: { type: 'number' } },
    'X-RateLimit-Bucket': { schema: { type: 'string' } }
};

const schemas: Record<string, OpenAPIV3.SchemaObject> = {};
const responses: Record<string, OpenAPIV3.ResponseObject> = {};

const swagger: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
        title: 'Discord REST Api',
        version: '10'
    },
    servers: [
        {
            url: 'https://discord.com/api/v10',
            description: 'The Discord v10 REST endpoint'
        }
    ],
    paths: (function () {
        const routes: Exclude<OpenAPIV3.Document['paths'], undefined> = {};
        for (const [fileName, fileContent] of files) {
            for (const match of fileContent.matchAll(/(?<=\n)## (?<name>.*?) % (?<method>.*?) (?<route>\/.*?)\n(?<content>[\s\S]+?)(?=\n## |$)/g)) {
                const { groups: { name, method, route, content } = {} } = match;

                const realRoute = route.replaceAll(/\{(.*?)(?:#.*?)?\}/g, (_, name) => `{${toCamelCase(name)}}`);
                const routeDetails: OpenAPIV3.PathItemObject = routes[realRoute] ??= {
                    parameters: [...route.matchAll(/(?<=\{)(?<name>.*?)(?:#(?<typeRef>.*?))?(?=\})/g)]
                        .map(match => {
                            const { groups: { name, typeRef = undefined } = {} } = match;
                            return {
                                name: toCamelCase(name),
                                in: 'path',
                                required: true,
                                schema: { type: 'string' }
                            }
                        })
                };
                const operation = routeDetails[toHttpMethod(method)] ??= {
                    responses: {
                        401: { $ref: '#/components/responses/DiscordUnauthorizedError' },
                        403: { $ref: '#/components/responses/DiscordForbiddenError' },
                        404: { $ref: '#/components/responses/DiscordNotFoundError' },
                        429: { $ref: '#/components/responses/DiscordRatelimitError' },
                        500: { $ref: '#/components/responses/DiscordApiError' },
                        502: { $ref: '#/components/responses/DiscordGatewayUnavailableError' }
                    }
                };

                applyEndpoint(operation, fileName, name, content);
            }
        }
        return routes;
    })(),
    security: [
        {
            BotToken: [],
            BearerToken: []
        }
    ],
    components: {
        securitySchemes: {
            BotToken: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization'
            },
            BearerToken: {
                type: 'http',
                scheme: 'Bearer'
            }
        },
        responses: {
            ...responses,
            DiscordUnauthorizedError: {
                description: 'The Authorization header was missing or invalid',
                content: {
                    'application/json': { schema: { $ref: '#/components/schemas/DiscordUnauthorizedError' } }
                }
            },
            DiscordForbiddenError: {
                description: 'The Authorization token you passed did not have permission to the resource',
                content: {
                    'application/json': { schema: { $ref: '#/components/schemas/DiscordForbiddenError' } }
                },
                headers: { ...commonHeaders }
            },
            DiscordNotFoundError: {
                description: 'The resource at the location specified doesn\'t exist',
                content: {
                    'application/json': { schema: { $ref: '#/components/schemas/DiscordNotFoundError' } }
                },
                headers: { ...commonHeaders }
            },
            DiscordRatelimitError: {
                description: 'You are being rate limited',
                content: {
                    'application/json': { schema: { $ref: '#/components/schemas/DiscordRatelimitError' } }
                },
                headers: {
                    ...commonHeaders,
                    'X-RateLimit-Global': { schema: { type: 'boolean' } },
                    'X-RateLimit-Scope': { schema: { enum: ['user', 'global', 'shared'] } },
                }
            },
            DiscordGatewayUnavailableError: {
                description: 'The discord gateway is unavailable, try again in a bit'
            },
            DiscordApiError: {
                description: 'Generic discord error',
                content: {
                    'application/json': { schema: { $ref: '#/components/schemas/DiscordApiError' } }
                },
                headers: { ...commonHeaders }
            }
        },
        schemas: {
            ...schemas,
            DiscordUnauthorizedError: {
                type: 'object',
                allOf: [{ $ref: '#/components/schemas/DiscordApiError' }],
                properties: {
                    code: { enum: [401] }
                }
            },
            DiscordForbiddenError: {
                type: 'object',
                allOf: [{ $ref: '#/components/schemas/DiscordApiError' }],
                properties: {
                    code: { enum: [403] }
                }
            },
            DiscordNotFoundError: {
                type: 'object',
                allOf: [{ $ref: '#/components/schemas/DiscordApiError' }],
                properties: {
                    code: { enum: [404] }
                }
            },
            DiscordRatelimitError: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    retry_after: { type: 'number' },
                    global: { type: 'boolean' }
                },
                required: ['message', 'retry_after', 'global']
            },
            DiscordApiError: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    code: { type: 'number' },
                    errors: { $ref: '#/components/schemas/DiscordErrorNode' }
                },
                required: ['message', 'code']
            },
            DiscordErrorDetails: {
                type: 'object',
                properties: {
                    code: { type: 'string' },
                    message: { type: 'string' },
                },
                additionalProperties: false,
                required: ['code', 'message']
            },
            DiscordErrorNode: {
                type: 'object',
                properties: {
                    _errors: { $ref: '#/components/schemas/DiscordErrorDetails' }
                },
                additionalProperties: { $ref: '#/components/schemas/DiscordErrorNode' }
            }
        }
    }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
await fs.writeFile(path.join(__dirname, '../sections.json'), JSON.stringify(sections, null, 4))
await fs.writeFile(path.join(__dirname, '../swagger.json'), JSON.stringify(swagger))