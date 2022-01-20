/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const props = path.split('.');
    return obj => {
        let looked = obj;
        for (const prop of props) {
            if (!looked || !Object.prototype.hasOwnProperty.call(looked, prop)) {
                return;
            }
            looked = looked[prop];
        }
        return looked;
    };
}
