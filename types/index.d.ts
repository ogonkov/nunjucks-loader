declare module '*.njk' {
    const template: (context?: object) => string | Promise<string | null>;

    export default template;
}
