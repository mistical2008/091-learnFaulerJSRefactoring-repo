/* eslint-disable no-use-before-define */
const playsObj = {
    hamlet: { name: 'Hamlet', type: 'tragedy' },
    'as-like': { name: 'As You Like It', type: 'comedy' },
    othello: { name: 'Othello', type: 'tragedy' },
};
// console.log(Object.keys(playsObj)[0] === 'hamlet');

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
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformances);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);

    function amountFor(aPerformance) {
        let result = 0;

        switch (aPerformance.play.type) {
        case 'tragedy':
            result = 40000;

            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;

        case 'comedy':
            result = 30000;

            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }

            result += 300 * aPerformance.audience;
            break;

        default:
            throw new Error(`unknown type: ${aPerformance.play.type}`);
        }
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);

        // Дополнительный бонус за каждые 10 комедий
        if (aPerformance.play.type === 'comedy') result += Math.floor(aPerformance.audience / 5);
        return result;
    }
    function totalAmount(data) {
        let result = 0;
        for (const perf of data.performances) {
            result += perf.amount;
        }
        return result;
    }
    function totalVolumeCredits(data) {
        let result = 0;

        for (const perf of data.performances) {
            result += perf.volumeCredits;
        }
        return result;
    }
    function enrichPerformances(aPerformance) {
        const result = { ...aPerformance };
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    return renderPlainText(statementData, plays);
}

function renderPlainText(data, plays) {
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
