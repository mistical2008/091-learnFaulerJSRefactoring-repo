function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformances);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;

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
}

module.exports = createStatementData;
