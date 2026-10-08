export function getRegexMatches(str: string, regex: RegExp) {
    const matches = regex.exec(str);
    if (matches === null) {
        return [];
    }

    const [, ...rest] = matches;
    return rest;
}
