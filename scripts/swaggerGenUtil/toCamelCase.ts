import { toPascalCase } from "./toPascalCase.js";

export function toCamelCase(text: string): string {
    text = toPascalCase(text);
    return `${text.slice(0, 1).toLowerCase()}${text.slice(1)}`;
}
