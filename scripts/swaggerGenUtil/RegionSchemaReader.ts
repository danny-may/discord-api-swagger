import { OpenAPIV3 } from "openapi-types";
import { IFileRegion } from "./File.js";
import { NotATypeError } from "./NotATypeError.js";
import { TableSchemaReader } from "./TableSchemaReader.js";

export class RegionSchemaReader {
    readonly #tableReader: TableSchemaReader;

    public constructor(tableReader: TableSchemaReader) {
        this.#tableReader = tableReader;
    }

    public read(region: IFileRegion, typePrefix: string): { region: IFileRegion, schema: OpenAPIV3.SchemaObject } {
        const match = this.#findTable(region);
        return {
            region: match.region,
            schema: this.#tableReader.read(match.region, typePrefix, match.table)
        };
    }


    #findTable(region: IFileRegion): { region: IFileRegion, table: string[][] } {
        for (const searchRegion of this.#getRegionsToSearch(region)) {
            const tables = [...this.#findTables(searchRegion.content)];
            switch (tables.length) {
                case 0: break;
                case 1: return {
                    region: searchRegion,
                    table: tables[0]
                        .map(row => row.slice(1).split('|').map(cell => cell.trim()))
                        .filter(row => !row.every(cell => cell === '' || cell.startsWith('-')))
                };
                default: throw new NotATypeError(`Multiple tables found in region ${searchRegion.id}`);
            }
        }

        throw new NotATypeError(`No tables found in region ${region.id}`);
    }

    * #getRegionsToSearch(root: IFileRegion): Iterable<IFileRegion> {
        yield root;
        for (const [postfix, replacement] of Object.entries(postfixReplacements)) {
            const [fileId, fragment] = root.id.split('/');
            if (fragment === undefined || !fragment.endsWith(postfix))
                continue;

            const newFragment = fragment.slice(0, -postfix.length) + replacement;

            yield* root.children.filter(c => c.id === `${fileId}/${newFragment}` || c.id === `${fileId}/${fragment}-${newFragment}`)
        }
    }

    * #findTables(content: string): Iterable<string[]> {
        const result: string[] = [];
        function* yieldTable() {
            if (result.length > 0)
                yield result.splice(0, result.length);
        }
        for (const line of content.split('\n').map(l => l.trim())) {
            if (!line.startsWith('|'))
                yield* yieldTable();
            else
                result.push(line);
        }
        yield* yieldTable();
    }
}

const postfixReplacements = {
    '-object': '-structure'
}