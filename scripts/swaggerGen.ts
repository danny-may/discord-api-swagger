import * as fs from 'fs/promises';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import { OpenAPIV3 } from 'openapi-types';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { TypeResolver } from './swaggerGenUtil/TypeResolver.js';
import { OperationResolver } from './swaggerGenUtil/OperationResolver.js';
import { RequestResolver } from "./swaggerGenUtil/RequestResolver.js";
import { ResponseResolver } from './swaggerGenUtil/ResponseResolver.js';
import { DocumentationResolver } from './swaggerGenUtil/DocumentationResolver.js';
import { FileProvider } from './swaggerGenUtil/FileProvider.js';
import { TableReader } from './swaggerGenUtil/TableReader.js';

const docsZipResponse = await fetch('https://github.com/discord/discord-api-docs/archive/refs/heads/main.zip');
if (docsZipResponse.status !== 200)
    throw new Error('Failed to download the docs repo');

const zip = new AdmZip(Buffer.from(await docsZipResponse.arrayBuffer()));

const schemas: Record<string, OpenAPIV3.SchemaObject> = {};
const requestBodies: Record<string, OpenAPIV3.RequestBodyObject> = {};
const responses: Record<string, OpenAPIV3.ResponseObject> = {};
const parameters: Record<string, OpenAPIV3.ParameterObject> = {};

const files = new FileProvider(zip.getEntries()
    .filter(e => !e.isDirectory && e.entryName.startsWith('discord-api-docs-main/docs/'))
    .map(e => ({ name: e.entryName.slice(22), content: e.getData().toString('utf-8') })));

const documentation = new DocumentationResolver(files);
const tableReader = new TableReader();
const typeResolver = new TypeResolver(files, schemas, documentation, tableReader);
const requestResolver = new RequestResolver(typeResolver, requestBodies);
const responseResolver = new ResponseResolver(typeResolver, responses);
const operationResolver = new OperationResolver(typeResolver, requestResolver, responseResolver, documentation);

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
        let result = {};
        for (const file of files)
            result = operationResolver.resolve(result, file);
        return result;
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
        requestBodies,
        parameters,
        responses,
        schemas
    }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
await fs.writeFile(path.join(__dirname, '../swagger.json'), JSON.stringify(swagger, null, 2))