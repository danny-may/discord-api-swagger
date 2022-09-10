import { FileProvider } from "./FileProvider.js";

export class DocumentationResolver {
    readonly #files: FileProvider;

    public constructor(files: FileProvider) {
        this.#files = files;

    }

    public getDocumentationUri(name: string): string {
        const [pathStr, fragment = undefined] = name.split('/');
        const { path: filePath } = this.#files.getFile(pathStr);

        let path = filePath.slice(0, filePath.lastIndexOf('.')).toLowerCase().replaceAll('_', '-');
        if (fragment !== undefined)
            path += `#${fragment.toLowerCase().replaceAll(' ', '-').replaceAll(/[^\w-]/g, '')}`;

        return `https://discord.com/developers/${path}`;
    }

    public resolveMarkdownLinks(markdown: string): string {
        return markdown.replaceAll(/(?<=\()#([A-Z_]+(?:\/[a-z-]+)?)(?=\))/g, (_, match) => this.getDocumentationUri(match));
    }
}