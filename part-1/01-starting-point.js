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
    let result = `Statement for ${invoice.customer}\n`;

    for (const perf of invoice.performances) {
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)}`;
        result += ` (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);

        // Дополнительный бонус за каждые 10 комедий
        if (playFor(aPerformance).type === 'comedy') result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;

        for (const perf of invoice.performances) {
            volumeCredits = volumeCreditsFor(perf);
        }
        return volumeCredits;
    }

    function amountFor(aPerformance) {
        let result = 0;

        switch (playFor(aPerformance).type) {
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
            throw new Error(`unknown type: ${playFor(aPerformance).type}`);
        }
        return result;
    }

    function totalAmount() {
        let result = 0;
        for (const perf of invoice.performances) {
            result += amountFor(perf);
        }
        return result;
    }

    // console.log(invoice);
    // console.log(plays);
}

const res = statement(invoiceObj[0], playsObj);
console.log(res);

module.exports.statement = statement;
module.exports.plays = playsObj;
module.exports.invoices = invoiceObj;
