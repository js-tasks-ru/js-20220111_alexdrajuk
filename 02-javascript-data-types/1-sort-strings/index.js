function compareFn(a, b) {
    const options = {
        caseFirst: 'upper',
        sensitivity: 'variant'
    };
    const collator = new Intl.Collator(['ru', 'en'], options); 
    return collator.compare(a, b);
}

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const arrCopy = arr.slice(0);
    arrCopy.sort(compareFn);
    if (param === 'desc') {
        arrCopy.reverse();
    }
    return arrCopy;
}
