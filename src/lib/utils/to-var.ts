export function toVar(symb: string) {
    return symb.replace(/[^a-zA-Z0-9_$]/g, '_');
}
