import { OpenAPIV3 } from "openapi-types";
import { IFileRegion } from "./File.js";
import { NotATypeError } from "./NotATypeError.js";
import { TypeReader } from "./TypeReader.js";

export class TableReader {
    public read(region: IFileRegion, table: string[][], reader: TypeReader): OpenAPIV3.SchemaObject {
        const headers = table[0];
        let readers = schemes.filter(s => s.targets.some(s =>
            s.regionId !== undefined
            && s.regionId.test(region.id)
            && s.headers.length === headers.length
            && s.headers.every((h, i) => headers[i].toLowerCase() === h.toLowerCase())
        ));

        if (readers.length === 0) {
            readers = schemes.filter(s => s.targets.some(s =>
                s.regionId === undefined
                && s.headers.length === headers.length
                && s.headers.every((h, i) => headers[i].toLowerCase() === h.toLowerCase())
            ));
        }

        if (readers.length > 1)
            throw new Error(`${region.id} - Multiple readers for headers ${JSON.stringify(headers)}`)

        if (readers.length === 0) {
            console.warn(`${region.id} - No reader for headers ${JSON.stringify(headers)}`);
            throw new NotATypeError(`${region.id} - No reader for headers ${JSON.stringify(headers)}`);
        }

        return readers[0].read(region, table.slice(1), reader);
    }
}

interface ITableReaderScheme {
    readonly targets: {
        readonly regionId?: RegExp;
        readonly headers: string[];
    }[]
    read(region: IFileRegion, table: string[][], reader: TypeReader): OpenAPIV3.SchemaObject;
}

const nameTypeDescObjectScheme: ITableReaderScheme = {
    targets: [
        { headers: ['field', 'type', 'description'] },
        { headers: ['field', 'type', 'description', 'required oauth2 scope'] },
        { headers: ['field', 'type', 'description', 'valid types'] },
        { headers: ['name', 'type', 'description'] }
    ],
    read(region, table, reader) {
        const properties: Record<string, OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject> = {};
        const required: string[] = [];
        for (const row of table) {
            const [field, type, description] = row;
            const meta = readName(field);
            if (!meta.optional)
                required.push(meta.name);

            const parsed = reader.readType(region, meta.name, type, description);
            const prop = properties[meta.name] = '$ref' in parsed ? { allOf: [parsed] } : parsed;
            if (meta.deprecated || description.includes('(deprecated)'))
                prop.deprecated = true;
            prop.description ??= '';
            prop.description += `\n\n${description}`;
            prop.description = prop.description.trim();
        }
        return {
            type: 'object',
            properties,
            required
        }
    }
};

const nameValueDescEnumScheme: ITableReaderScheme = {
    targets: [
        { headers: ['name', 'value'] },
        { headers: ['type', 'value'] },
        { headers: ['name', 'value', 'description'] },
        { headers: ['name', 'value', 'note'] },
        { headers: ['name', 'value', 'color', 'required field'] },
        { headers: ['key', 'value', 'description'] },
        { headers: ['mode', 'value', 'description'] },
        { headers: ['level', 'integer', 'description'] },
        { headers: ['level', 'value'] },
        { headers: ['type', 'id', 'description'] },
        { headers: ['type', 'value', 'description'] },
        { headers: ['type', 'value', 'description', 'max per guild'] },
        { headers: ['level', 'value', 'description'] },
        {
            regionId: /^DOCS_INTERACTIONS_APPLICATION_COMMANDS\/application-command-object-application-command-types$/,
            headers: ['name', 'type', 'description']
        },
    ],
    read(_region, table) {
        const values: { asString: string, asNumber: number, display(value: unknown): string | undefined }[] = [];
        for (const [name, value, description = ''] of table) {
            values.push({
                asString: value,
                asNumber: parseFloat(value),
                display(value) {
                    if (name === '') {
                        if (description === '')
                            return undefined;

                        return `- ${JSON.stringify(value)} - ${description}`;
                    }
                    if (description === '')
                        return `- ${toEnumName(name)} (\`${JSON.stringify(value)}\`)`;

                    return `- ${toEnumName(name)} (\`${JSON.stringify(value)}\`) - ${description}`
                }
            });
        }

        const [type, selector]: [OpenAPIV3.NonArraySchemaObject['type'], (x: typeof values[number]) => unknown] = values.some(v => isNaN(v.asNumber))
            ? ['string', x => x.asString]
            : values.some(v => v.asNumber % 1 !== 0)
                ? ['number', x => x.asNumber]
                : ['integer', x => x.asNumber]

        return {
            type,
            enum: values.map(selector),
            description: values.map(v => v.display(selector(v))).filter(v => v !== undefined).join('\n')
        }
    }
}

const valueNameDescEnumScheme: ITableReaderScheme = {
    targets: [
        { headers: ['value', 'name'] },
        { headers: ['code', 'meaning'] },
        { headers: ['value', 'name', 'description'] },
        { headers: ['locale', 'language name', 'native name'] },
    ],
    read(region, table, resolver) {
        return nameValueDescEnumScheme.read(region, table.map(([value, name, ...rest]) => [name, value, ...rest]), resolver)
    }
}

const valueDescEnumScheme: ITableReaderScheme = {
    targets: [
        { headers: ['feature', 'description'] },
        { headers: ['name', 'description'] },
        { headers: ['type', 'description'] },
    ],
    read(region, table, resolver) {
        return nameValueDescEnumScheme.read(region, table.map(([value, ...rest]) => ['', value, ...rest]), resolver)
    }
}

const nameValueDescFlagScheme: ITableReaderScheme = {
    targets: [
        { regionId: /-flags$/, headers: ['flag', 'value', 'description'] },
        { regionId: /-flags$/, headers: ['permission', 'value', 'description', 'channel type'] },
    ],
    read(region, table) {
        const values: Array<{ asString: string, asNumber: number, display(value: unknown): string | undefined }> = [];
        for (const [name, value, description] of table) {
            const match = value.match(/1 << (\d+)/);
            if (match === null) {
                console.warn(`${region.id} - Cannot understand ${JSON.stringify(value)} as a flag value`);
                continue;
            }
            const bitPos = parseInt(match[1]);
            const asNumber = bitPos > 31 ? NaN : 1 << bitPos;
            const asString = (1n << BigInt(bitPos)).toString();

            values.push({
                asString: asString,
                asNumber: asNumber,
                display(value) {
                    if (name === '') {
                        if (description === '')
                            return undefined;

                        return `- ${JSON.stringify(value)} - ${description}`;
                    }
                    if (description === '')
                        return `- ${toEnumName(name)} (\`${JSON.stringify(value)}\`)`;

                    return `- ${toEnumName(name)} (\`${JSON.stringify(value)}\`) - ${description}`
                }
            });
        }

        const [type, selector]: [OpenAPIV3.NonArraySchemaObject['type'], (x: typeof values[number]) => unknown] = values.some(v => isNaN(v.asNumber))
            ? ['string', x => x.asString]
            : ['integer', x => x.asNumber]

        return {
            type,
            format: type === 'string' ? 'uint64' : undefined,
            enum: values.map(selector),
            description: values.map(v => v.display(selector(v))).filter(v => v !== undefined).join('\n')
        }
    },
}

const valueNameDescFlagScheme: ITableReaderScheme = {
    targets: [
        { regionId: /-flags$/, headers: ['value', 'name', 'description'] },
    ],
    read(region, table, typeResolver) {
        return nameValueDescFlagScheme.read(region, table.map(([value, name, ...rest]) => [name, value, ...rest]), typeResolver);
    }
}

const schemes: ITableReaderScheme[] = [
    nameTypeDescObjectScheme,
    nameValueDescEnumScheme,
    valueNameDescEnumScheme,
    valueDescEnumScheme,
    nameValueDescFlagScheme,
    valueNameDescFlagScheme,
    {
        targets: [
            {
                regionId: /^DOCS_RESOURCES_AUTO_MODERATION\/auto-moderation-action-object-action-metadata$/,
                headers: ['field', 'type', 'associated action types', 'description'],
            }
        ],
        read(region, table, resolver) {
            return nameTypeDescObjectScheme.read(region, table.map(([field, type, desc1, desc2, ...rest]) => [`${field}?`, type, `${desc1} - ${desc2}`, ...rest]), resolver)
        }
    }
]

function readName(name: string): { name: string, deprecated: boolean, optional: boolean } {
    const match = name.match(/^(?<realName>[\w\[\]]+)(?<optional>\?)?(?<rest>.*)/);
    if (match?.groups?.realName === undefined)
        throw new Error(`Unable to read ${JSON.stringify(name)} as a field name`);

    const { realName, optional = undefined, rest } = match.groups;
    const deprecated = rest.includes('(deprecated)');
    if (rest.replaceAll(/\\|\*|\s|\(deprecated\)/g, '').length > 0)
        console.warn('REST: ', JSON.stringify(rest));

    return { name: realName, deprecated, optional: optional !== undefined };
}

function toEnumName(name: string): string {
    return name.replaceAll('-', '_').replaceAll(/\W/g, '');
}