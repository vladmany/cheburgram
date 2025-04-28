export function camelToSnakeCase(obj) {
    const snakeObj = {};
    for (const [key, value] of Object.entries(obj)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        snakeObj[snakeKey] = value;
    }
    return snakeObj;
}