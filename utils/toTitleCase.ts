export function toTitleCase(str: string) {
    return str.replace("_", " ").replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
}