import * as path from "path";
import { File, IFileRegion } from "./File.js";

export class FileProvider implements Iterable<File> {
    readonly #fileMap: Map<string, File>;
    readonly #regionMap: Map<string, Set<IFileRegion>>;

    public constructor(files: Iterable<{ name: string, content: string }>) {
        this.#fileMap = new Map((function* () {
            for (const file of files) {
                const noExt = file.name.slice(0, file.name.lastIndexOf('.'));
                const id = noExt.toUpperCase().replaceAll(/[\/-]/g, '_');
                const result = new File(id, file.name, path.basename(noExt), file.content);
                yield [id, result];
            }
        })());

        this.#regionMap = new Map();
        for (const file of this.#fileMap.values()) {
            for (const region of file) {
                let regions = this.#regionMap.get(region.id);
                if (regions === undefined)
                    this.#regionMap.set(region.id, regions = new Set());
                regions.add(region);
            }
        }
    }

    public *[Symbol.iterator](): Iterator<File, any, undefined> {
        yield* this.#fileMap.values();
    }

    public getFile(id: string): File {
        while (id in fileRemappings)
            id = fileRemappings[id];

        const result = this.#fileMap.get(id);
        if (result === undefined)
            throw new Error(`Unknown file ${JSON.stringify(id)}`);
        return result;
    }

    public getRegion(id: string): IFileRegion | undefined {
        let fileId = id.split('/')[0];
        while (fileId in fileRemappings)
            fileId = fileRemappings[fileId];
        id = [fileId, ...id.split('/').slice(1)].join('/');

        const regions = this.#regionMap.get(id);

        switch (regions?.size) {
            case undefined: return undefined;
            case 1: return [...regions][0];
            default: throw new Error(`Duplicate region id ${JSON.stringify(id)}`)
        }
    }
}

const fileRemappings: Record<string, string> = {
    'DOCS_LOBBIES': 'DOCS_GAME_SDK_LOBBIES'
}