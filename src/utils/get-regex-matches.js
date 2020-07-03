export function getRegexMatches(str, regex) {
    const matches = regex.exec(str);
    if (matches === null) {
        return [];
    }

    const [, ...rest] = matches;
    return rest;
}
