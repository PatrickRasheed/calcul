/**
 * Tests Jest pour le module calculatrice
 * Test les quatre opérations mathématiques et la gestion des erreurs
 */

const { add, sub, mul, div } = require('../src/calculator');

describe('Module Calculatrice', () => {
  
  describe('Addition', () => {
    test('devrait additionner deux nombres positifs', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('devrait additionner des nombres négatifs', () => {
      expect(add(-2, 3)).toBe(1);
    });

    test('devrait additionner zéro', () => {
      expect(add(0, 5)).toBe(5);
    });

    test('devrait additionner deux zéros', () => {
      expect(add(0, 0)).toBe(0);
    });

    test('devrait additionner des nombres décimaux', () => {
      expect(add(2.5, 3.5)).toBe(6);
    });
  });

  describe('Soustraction', () => {
    test('devrait soustraire deux nombres positifs', () => {
      expect(sub(8, 2)).toBe(6);
    });

    test('devrait soustraire un nombre plus grand d\'un plus petit', () => {
      expect(sub(5, 10)).toBe(-5);
    });

    test('devrait soustraire avec zéro', () => {
      expect(sub(5, 0)).toBe(5);
    });

    test('devrait soustraire deux zéros', () => {
      expect(sub(0, 0)).toBe(0);
    });

    test('devrait soustraire des nombres décimaux', () => {
      expect(sub(5.5, 2.5)).toBe(3);
    });
  });

  describe('Multiplication', () => {
    test('devrait multiplier deux nombres positifs', () => {
      expect(mul(4, 3)).toBe(12);
    });

    test('devrait multiplier avec un nombre négatif', () => {
      expect(mul(-4, 3)).toBe(-12);
    });

    test('devrait multiplier avec zéro', () => {
      expect(mul(5, 0)).toBe(0);
    });

    test('devrait multiplier deux zéros', () => {
      expect(mul(0, 0)).toBe(0);
    });

    test('devrait multiplier des nombres décimaux', () => {
      expect(mul(2.5, 4)).toBe(10);
    });
  });

  describe('Division', () => {
    test('devrait diviser deux nombres positifs', () => {
      expect(div(10, 2)).toBe(5);
    });

    test('devrait diviser et retourner un nombre décimal', () => {
      expect(div(10, 3)).toBeCloseTo(3.333, 2);
    });

    test('devrait diviser un nombre par un nombre négatif', () => {
      expect(div(10, -2)).toBe(-5);
    });

    test('devrait diviser zéro', () => {
      expect(div(0, 5)).toBe(0);
    });

    test('devrait lever une erreur pour division par zéro', () => {
      expect(() => div(10, 0)).toThrow();
      expect(() => div(10, 0)).toThrow('Division par zéro impossible');
    });

    test('devrait lever une erreur avec zéro et zéro', () => {
      expect(() => div(0, 0)).toThrow('Division par zéro impossible');
    });

    test('devrait diviser des nombres décimaux', () => {
      expect(div(10.5, 2.5)).toBeCloseTo(4.2, 1);
    });
  });

  describe('Cas limites', () => {
    test('devrait gérer les très grands nombres', () => {
      expect(add(Number.MAX_SAFE_INTEGER - 1, 1)).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('devrait gérer les nombres très petits', () => {
      expect(add(0.0001, 0.0002)).toBeCloseTo(0.0003);
    });

    test('devrait gérer les opérations avec des nombres négatifs', () => {
      expect(sub(-5, -3)).toBe(-2);
      expect(mul(-4, -5)).toBe(20);
    });
  });

});
