export function addonsLoader(list) {
    return Promise.all(list.map(
        (item) => Promise.resolve(item.instance).then(() => item)
    ));
}
