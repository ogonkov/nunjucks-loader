export function getErrorCopy(error) {
    const newError = new Error(error.message);
    newError.code = error.code;

    return newError;
}
