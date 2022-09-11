export class File implements Iterable<IFileRegion> {
    readonly rootRegion: IFileRegion;

    public constructor(
        public readonly id: string,
        public readonly path: string,
        public readonly name: string,
        content: string) {
        this.rootRegion = readContentRegions(content, this);
    }

    public *[Symbol.iterator]() {
        const regions = [this.rootRegion];
        let region;
        while ((region = regions.pop()) !== undefined) {
            regions.push(...region.children);
            yield region;
        }
    }

    public findRegions(name: RegExp): Iterable<{ match: RegExpMatchArray; region: IFileRegion; }> {
        return this.rootRegion.findChildren(name);
    }
}

export interface IFileRegion {
    readonly id: string;
    readonly file: File;
    readonly depth: number;
    readonly name: string;
    readonly content: string;
    readonly children: readonly IFileRegion[];
    findChildren(name: RegExp): Iterable<{ match: RegExpMatchArray; region: IFileRegion; }>;
}

class MutableFileRegion implements IFileRegion {
    #content: string;
    public children: MutableFileRegion[];

    public get content() {
        return this.#content;
    }
    public set content(value) {
        this.#content = value.trim();
    }

    public constructor(
        public readonly id: string,
        public readonly file: File,
        public readonly depth: number,
        public readonly name: string) {
        this.#content = '';
        this.children = [];
    }

    public * findChildren(name: RegExp): Iterable<{ match: RegExpMatchArray; region: IFileRegion; }> {
        const match = this.name.match(name);
        if (match !== null)
            yield { match, region: this };

        for (const child of this.children)
            yield* child.findChildren(name);
    }
}


function readContentRegions(source: string, file: File): IFileRegion {
    const root = new MutableFileRegion(file.id, file, 0, '')
    const regionStack = [root];
    let inCodeBlock = false;
    for (const line of source.split('\n')) {
        if ([...line.matchAll(/(?<!` ?)```(?! ?`)/g)].length % 2 === 1)
            inCodeBlock = !inCodeBlock;

        const depthMatch = line.match(/^#+/);
        if (inCodeBlock || depthMatch === null) {
            regionStack[regionStack.length - 1].content += `\n${line}`
            continue;
        }

        const depth = depthMatch[0].length;
        while (regionStack[regionStack.length - 1].depth >= depth)
            regionStack.pop();

        const name = line.slice(depth).trim();
        const container = depth <= 5 ? root : (function () {
            for (let i = regionStack.length - 1; i >= 0; i--) {
                if (regionStack[i].depth <= 5)
                    return regionStack[i];
            }
            return root;
        })();
        let fragment = name.split('%')[0]
            .replaceAll(/[^ A-Z0-9]+/gi, '')
            .trim()
            .replaceAll(/ +/g, '-')
            .toLowerCase();

        if (container.id.includes('/'))
            fragment = `${container.id.split('/')[1]}-${fragment}`;

        const region = new MutableFileRegion(`${file.id}/${fragment}`, file, depth, name);
        regionStack[regionStack.length - 1].children.push(region);
        regionStack.push(region)
    }

    return root;
}