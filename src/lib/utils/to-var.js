export function toVar(symb) {
    return symb.replace(/[^a-zA-Z0-9_$]/g, '_');
}
