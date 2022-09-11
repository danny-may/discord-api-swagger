import * as fs from 'fs/promises';
import * as YAML from 'yaml';
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
import { TableSchemaReader } from './swaggerGenUtil/TableSchemaReader.js';
import { RegionSchemaReader } from './swaggerGenUtil/RegionSchemaReader.js';
import { TypeReader } from './swaggerGenUtil/TypeReader.js';

const docsZipResponse = await fetch('https://github.com/discord/discord-api-docs/archive/refs/heads/main.zip');
if (docsZipResponse.status !== 200)
    throw new Error('Failed to download the docs repo');

const zip = new AdmZip(Buffer.from(await docsZipResponse.arrayBuffer()));

const schemas: Record<string, OpenAPIV3.SchemaObject> = {};
const requestBodies: Record<string, OpenAPIV3.RequestBodyObject> = {};
const responses: Record<string, OpenAPIV3.ResponseObject> = {};
const parameters: Record<string, OpenAPIV3.ParameterObject> = {};

const files = new FileProvider(zip.getEntries()
    .sort((a, b) => a.name < b.name ? -1 : 1)
    .filter(e => !e.isDirectory && e.entryName.startsWith('discord-api-docs-main/docs/'))
    .map(e => ({ name: e.entryName.slice(22), content: e.getData().toString('utf-8') })));

const documentation = new DocumentationResolver(files);
let tr: TypeResolver | undefined;
const typeReader = new TypeReader(() => tr);
const tableReader = new TableSchemaReader(typeReader);
const regionReader = new RegionSchemaReader(tableReader)
const typeResolver = tr = new TypeResolver(files, schemas, documentation, regionReader, {
    'DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up': 'DOCS_RESOURCES_APPLICATION/application-object',
    'DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-data': 'DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-application-command-data-structure',
    'DOCS_TOPICS_PERMISSIONS': 'DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags'
});
const requestResolver = new RequestResolver(regionReader, requestBodies);
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
            if (!file.id.startsWith('DOCS_GAME_SDK'))
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
const json = JSON.stringify(swagger);
const yaml = YAML.stringify(swagger, { lineWidth: 0, aliasDuplicateObjects: false });
await fs.writeFile(path.join(__dirname, '../swagger.json'), json);
await fs.writeFile(path.join(__dirname, '../swagger.yaml'), yaml);