declare module '#dist/*' {
    export default function render(data: Record<string, unknown>): string | Promise<string>;
}
