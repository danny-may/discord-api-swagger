export function toPascalCase(text: string): string {
    return text.replaceAll(/(?:^|[^a-z0-9]+)([a-z0-9])/gi, (_, c) => c.toUpperCase());
}