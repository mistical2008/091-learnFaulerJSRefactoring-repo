/* eslint-disable no-use-before-define */
const createStatementData = require('./createStatementData');

const playsObj = {
    hamlet: { name: 'Hamlet', type: 'tragedy' },
    'as-like': { name: 'As You Like It', type: 'comedy' },
    othello: { name: 'Othello', type: 'tragedy' },
};

const invoiceObj = [
    {
        customer: 'BigCo',
        performances: [
            {
                playID: 'hamlet',
                audience: 55,
            },
            {
                playID: 'as-like',
                audience: 35,
            },
            {
                playID: 'othello',
                audience: 40,
            },
        ],
    },
];

function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(aNumber);
}

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;

    for (const perf of data.performances) {
        result += ` ${perf.play.name}: ${usd(perf.amount / 100)}`;
        result += ` (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(data.totalAmount / 100)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
}
const res = statement(invoiceObj[0], playsObj);
console.log(res);

module.exports.statement = statement;
module.exports.plays = playsObj;
module.exports.invoices = invoiceObj;
