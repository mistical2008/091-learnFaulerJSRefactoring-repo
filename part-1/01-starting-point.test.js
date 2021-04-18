const { statement, invoices, plays } = require('./01-starting-point');
/* eslint-disable */

// prettier-ignore-start
describe('Part 1:', () => {
    /* eslint-disable */
    test(`Should return: 
        Statement for BigCo
         Hamlet: $650.00 (55 seats)
         As You Like It: $580.00 (35 seats)
         Othello: $500.00 (40 seats)
        Amount owed is $1,730.00
        You earned 47 credits`, () => {
        expect(statement(invoices[0], plays)).toMatch(
            `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits`,
            // prettier-ignore-end
        );
    });
});
