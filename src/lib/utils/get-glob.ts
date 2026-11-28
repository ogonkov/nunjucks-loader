export async function getGlob(): Promise<typeof import('glob').glob> {
    const {glob} = await import('glob');
    return glob;
}
