// TODO: Move this into the client side.

/**
 * Parse a string of equation into an object for balancing.
 * @param {String} equation The equation to parse as a string.
 * @returns The object which represents the equation.
 */
function parseEq(eq) {
    if (!eq) return;
    const r = eq.split('->').map((x) =>
        x
            .split('+')
            .map((y) => y.replace(/[^a-zA-Z0-9]+/g, ''))
            .filter(Boolean)
    );
    if (r.length < 2 || !r[0].length || !r[1].length) return;
    /**
     * @property {String[]} reactants
     * @property {String[]} products
     */
    return {reactants: r[0], products: r[1]};
}

/**
 * This function mostly rely on `reaction-balancer`.
 * @link https://github.com/djanidaud/reaction-balancer
 */
function balance(eq) {
    eq = parseEq(eq);
    if (!eq) return null;
    const r = require('reaction-balancer')(eq);
    return format(eq, [...r]);
}

/**
 *
 * @param {Object} equation The equation object from `parseEq`.
 * @param {Array<string, number>[]} balanced The balanced equation from `balance`.
 * @returns {String} The parsed equation.
 */
function format(eq, balanced) {
    // console.log(eq, '\n', balanced)
    const f = (x) =>
        eq[x]
            .map((x) => {
                const n = balanced.find((y) => y[0] === x)[1];
                return (n === 1 ? '' : n) + x;
            })
            .join(' + ');
    return Object.keys(eq).map(f).join(' -> ');
}

module.exports = balance;
