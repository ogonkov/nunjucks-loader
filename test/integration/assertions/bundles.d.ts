declare module '*.cjs' {
    export default function render(data: Record<string, string>): string | Promise<string>;
}
