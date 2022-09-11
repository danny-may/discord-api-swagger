import { FileProvider } from "./FileProvider.js";

export class DocumentationResolver {
    readonly #files: FileProvider;

    public constructor(files: FileProvider) {
        this.#files = files;

    }

    public getDocumentationUri(name: string): string {
        const [pathStr, fragment = ''] = name.split('/');
        const { path: filePath } = this.#files.getFile(pathStr);

        let path = filePath.slice(0, filePath.lastIndexOf('.')).toLowerCase().replaceAll('_', '-');
        if (fragment !== '')
            path += `#${fragment.toLowerCase().replaceAll(' ', '-').replaceAll(/[^\w-]/g, '')}`;

        return `https://discord.com/developers/${path}`;
    }

    public resolveMarkdownLinks(markdown: string): string {
        return markdown.replaceAll(/(?<=\()#([A-Z0-9_]+\/?(?:[a-z0-9-]+)?)(?=\))/g, (_, match) => this.getDocumentationUri(match));
    }
}