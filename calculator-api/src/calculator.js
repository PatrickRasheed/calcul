/**
 * Module de calcul - Contient les fonctions mathématiques
 */

/**
 * Additionne deux nombres
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} La somme de a et b
 */
function add(a, b) {
  return a + b;
}

/**
 * Soustrait deux nombres
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} La différence (a - b)
 */
function sub(a, b) {
  return a - b;
}

/**
 * Multiplie deux nombres
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} Le produit de a et b
 */
function mul(a, b) {
  return a * b;
}

/**
 * Divise deux nombres
 * @param {number} a - Dividende
 * @param {number} b - Diviseur
 * @returns {number} Le résultat de la division (a / b)
 * @throws {Error} Si b = 0 (division par zéro)
 */
function div(a, b) {
  if (b === 0) {
    throw new Error('Division par zéro impossible');
  }
  return a / b;
}

module.exports = { add, sub, mul, div };
