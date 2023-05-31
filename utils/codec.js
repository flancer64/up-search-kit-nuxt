/**
 * Convert strings from "al-pacino" to "Al Pacino".
 * @param {string} param
 * @return {string|null}
 */
export function decodeKey(param) {
    if (param) {
        const words = param.split('-');
        const capitalized = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalized.join(' ');
    } else return null;
}

/**
 * Convert strings from "Al Pacino" to "al-pacino".
 * @param {string} param
 * @return {string}
 */
export function encodeKey(param) {
    const lower = param.toLowerCase();
    return lower.replaceAll(' ', '-');
}
