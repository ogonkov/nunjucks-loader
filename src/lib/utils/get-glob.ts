export async function getGlob() {
    const {glob} = await import('glob');
    return glob;
}
