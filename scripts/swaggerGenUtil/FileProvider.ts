import * as path from "path";
import { File } from "./File.js";

export class FileProvider implements Iterable<File> {
    readonly #fileMap: Map<string, File>;

    public constructor(files: Iterable<{ name: string, content: string }>) {
        this.#fileMap = new Map((function* () {
            for (const file of files) {
                const noExt = file.name.slice(0, file.name.lastIndexOf('.'));
                const id = noExt.toUpperCase().replaceAll(/[\/-]/g, '_');
                const result = new File(id, file.name, path.basename(noExt), file.content);
                yield [id, result];
                const noUnderscores = `${path.dirname(file.name).split('/').filter(x => !x.includes('_')).join('_')}_${path.basename(noExt)}`.toUpperCase();
                if (noUnderscores !== id)
                    yield [noUnderscores, result];
            }
        })());
    }

    public *[Symbol.iterator](): Iterator<File, any, undefined> {
        yield* this.#fileMap.values();
    }

    public getFile(key: string): File {
        const result = this.#fileMap.get(key);
        if (result === undefined)
            throw new Error(`Unknown file ${JSON.stringify(key)}`);
        return result;
    }
}
