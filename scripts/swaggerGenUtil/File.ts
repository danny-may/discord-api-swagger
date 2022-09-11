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

    public * findRegions(name: RegExp): Iterable<{ match: RegExpMatchArray; region: IFileRegion; }> {
        const pending: IMutableFileRegion[] = [this.rootRegion as IMutableFileRegion];
        let region;
        while ((region = pending.shift()) !== undefined) {
            pending.push(...region.children);
            const match = region.name.match(name);
            if (match !== null)
                yield { match, region };
        }
    }
}

export interface IFileRegion {
    readonly id: string;
    readonly file: File;
    readonly depth: number;
    readonly name: string;
    readonly content: string;
    readonly children: readonly IFileRegion[];
}

interface IMutableFileRegion {
    id: string;
    file: File;
    depth: number;
    name: string;
    content: string;
    children: IMutableFileRegion[];
}


function readContentRegions(source: string, file: File): IFileRegion {
    const root: IMutableFileRegion = {
        id: file.id,
        file,
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
        let fragment = name.split('%')[0]
            .replaceAll(/[^ A-Z0-9]+/gi, '')
            .trim()
            .replaceAll(/ +/g, '-')
            .toLowerCase();
        if (depth > 5) {
            let parent: IMutableFileRegion | undefined;
            for (let i = regionStack.length - 1; i >= 0; i--) {
                if (regionStack[i].depth <= 5) {
                    parent = regionStack[i];
                    break;
                }
            }
            if (parent !== undefined)
                fragment = `${parent.id.split('/')[1]}-${fragment}`;
        }
        const region: IMutableFileRegion = {
            id: `${file.id}/${fragment}`,
            name,
            depth,
            file,
            children: [],
            content: ''
        }

        regionStack[regionStack.length - 1].children.push(region);
        regionStack.push(region)
    }

    return root;
}