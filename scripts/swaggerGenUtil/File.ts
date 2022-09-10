export class File {
    readonly rootRegion: IFileRegion;

    public constructor(
        public readonly id: string,
        public readonly path: string,
        public readonly name: string,
        content: string) {
        this.rootRegion = readContentRegions(content, this);
    }

    public getRegions(): Iterable<IFileRegion>;
    public getRegions(name: string): Iterable<IFileRegion>;
    public getRegions(filter: (region: IFileRegion) => boolean): Iterable<IFileRegion>;
    public getRegions(name: RegExp): Iterable<{ match: RegExpMatchArray; region: IFileRegion; }>;
    public getRegions(name?: string | RegExp | ((region: IFileRegion) => boolean)): Iterable<IFileRegion> | Iterable<{ match: RegExpMatchArray; region: IFileRegion; }>;
    public *getRegions(name?: string | RegExp | ((region: IFileRegion) => boolean)): Iterable<IFileRegion | { match: RegExpMatchArray; region: IFileRegion; }> {
        const filter = createFilter(name);
        const pending: IMutableFileRegion[] = [this.rootRegion as IMutableFileRegion];
        let region;
        while ((region = pending.shift()) !== undefined) {
            pending.push(...region.children);
            yield* filter(region);
        }
    }
}

export interface IFileRegion {
    readonly fragments: readonly string[];
    readonly file: File;
    readonly depth: number;
    readonly name: string;
    readonly content: string;
    readonly children: readonly IFileRegion[];
}

interface IMutableFileRegion {
    fragments: string[];
    file: File;
    depth: number;
    name: string;
    content: string;
    children: IMutableFileRegion[];
}


function readContentRegions(source: string, file: File): IFileRegion {
    const root: IMutableFileRegion = {
        file,
        fragments: [],
        children: [],
        content: '',
        depth: 0,
        name: ''
    };
    const regionStack: IMutableFileRegion[] = [root];
    let inCodeBlock = false;
    for (const line of source.split('\n')) {
        if (line.startsWith('```'))
            inCodeBlock = !inCodeBlock;
        if (inCodeBlock)
            continue;
        const depthMatch = line.match(/^#+/);
        if (depthMatch === null) {
            regionStack[regionStack.length - 1].content = (regionStack[regionStack.length - 1].content + '\n' + line).trim();
            continue;
        }

        const depth = depthMatch[0].length;
        while (regionStack[regionStack.length - 1].depth >= depth)
            regionStack.pop();

        const name = line.slice(depth).trim();
        const parent = regionStack[regionStack.length - 1];
        const fragment = name.split('%')[0].trim().replaceAll(/[^a-zA-Z0-9-]+/g, '-').toLowerCase();
        const region: IMutableFileRegion = {
            name,
            depth,
            fragments: [
                fragment,
                ...parent.fragments.map(f => f + '-' + fragment)
            ],
            file,
            children: [],
            content: ''
        }

        parent.children.push(region);
        regionStack.push(region)
    }

    root.fragments.push('');
    return root;
}

function createFilter(filter: Parameters<File['getRegions']>[0]): (region: IMutableFileRegion) => Iterable<IFileRegion | { match: RegExpMatchArray; region: IFileRegion; }> {
    switch (typeof filter) {
        case 'string': return function* (region) {
            if (region.name.toLowerCase() === filter)
                yield region;
            else if (region.fragments.includes(filter)) {
                // Each region only has 1 valid id, but I couldnt work out how its computed.
                // This way, the first time a fragment match is found, the other fragments are removed
                if (region.fragments.length > 1)
                    region.fragments = [filter];
                yield region;
            }
        };
        case 'undefined': return function* (region) {
            yield region;
        };
        case 'object': return function* (region) {
            const match = region.name.match(filter);
            if (match !== null)
                yield { match, region };
        };
        case 'function': return function* (region) {
            if (filter(region))
                yield region;
        }
    }
}