/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (!string || size === 0) {
        return '';
    }
    if (!size) {
        return string;
    }
    const charMap = new Map();
    let key = Symbol();
    let value;
    let previousChar;
    string.split('').forEach(char => {
        if (char !== previousChar) {
            key = Symbol();
        }
        previousChar = char;
        value = charMap.has(key) ? charMap.get(key) + char : char;
        charMap.set(key, value);
    });

    return Array.from(charMap.values()).reduce((acc, current) => {
        return acc + (current.length > size ? current[0].repeat(size) : current);
    }, '');
}
