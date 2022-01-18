/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const arrCopy = [...arr];
    arrCopy.sort((a, b) => {
        const options = {
            caseFirst: 'upper',
            sensitivity: 'variant'
        };
        const collator = new Intl.Collator(['ru', 'en'], options);
        return (param === 'asc') ? collator.compare(a, b) : collator.compare(b, a);
    });
    return arrCopy;
}

