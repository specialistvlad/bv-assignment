/** 
 * getDistanceBetweenAirports(origin: string, destination: string): number
 * origin: 3-character departure airport code
 * destination: 3-character arrival airport code
 * returns: distance between airports, in kilometers
 */

function charToNumber (s: String, i: number) {
    return parseInt(s.charAt(i), 36) - 9;
}

function sumChars (s: String) {
    var i = s.length, r = 0;
    while (--i >= 0) r += charToNumber(s, i);
    return r;
}

export default (origin: string, destination: string) => {
    return Math.abs(sumChars(destination) - sumChars(origin) + 20) * 100;
}