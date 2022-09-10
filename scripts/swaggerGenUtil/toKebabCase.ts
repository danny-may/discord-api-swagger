export function toKebabCase(text: string): string {
    return text.replaceAll(/(?<=[a-z])(?=[A-Z])/g, '-').toLowerCase().replaceAll(/\W+/g, '-');
}
