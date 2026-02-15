// RoastData.js - Analyzes expense data and returns statistics
export let data = {
    totalAmt: 0,
    payment: {
        paymentOnline: 0,
        paymentOffline: 0,
        online: 0,
        offline: 0
    },
    category: {
        moneySpent: {},
        timesUsed: {}
    },
    usedTags: {},
    percentages: {
        online: 0,
        offline: 0,
        category: {}
    },
    top4Data: [],
    others: 0
};

export let preff = {
    preffPaymentMode: '',
    preffCategory: {
        key: '',
        value: 0
    },
    top4Tags: []
};
export const scores = JSON.parse(localStorage.getItem('scores')) || {
    editCount: 0,
    addCount: 0,
    deleteCount: 0
};

export function resetData() {
    data = {
        totalAmt: 0,
        payment: {
            paymentOnline: 0,
            paymentOffline: 0,
            online: 0,
            offline: 0
        },
        category: {
            moneySpent: {},
            timesUsed: {}
        },
        usedTags: {},
        percentages: {
            online: 0,
            offline: 0,
            category: {}
        },
        top4Data: [],
        others: 0
    };

    preff = {
        preffPaymentMode: '',
        preffCategory: {
            key: '',
            value: 0
        },
        top4Tags: []
    };

}
export function analyzeExpenses(filteredData) {

    // get values
    filteredData.forEach(exp => {
        const amount = Number(exp.amount);
        data.totalAmt += amount;

        // payment summary
        if (exp.paymentMode === '0') {
            data.payment.paymentOnline += amount;
            data.payment.online++;
        } else {
            data.payment.paymentOffline += amount;
            data.payment.offline++;
        }

        // get category
        if (!data.category.timesUsed[exp.category]) {
            data.category.moneySpent[exp.category] = 0;
            data.category.timesUsed[exp.category] = 0;
        }
        data.category.moneySpent[exp.category] += amount;
        data.category.timesUsed[exp.category]++;

        // get tags
        exp.tags.forEach(tag => {
            data.usedTags[tag] = (data.usedTags[tag] || 0) + 1;
        });
    });

    // Calculating percentages//
    if (data.totalAmt > 0) {
        data.percentages.online = (data.payment.paymentOnline / data.totalAmt * 100).toFixed(2);
        data.percentages.offline = (data.payment.paymentOffline / data.totalAmt * 100).toFixed(2);

        for (const [key, value] of Object.entries(data.category.moneySpent)) {
            data.percentages.category[key] = (value / data.totalAmt * 100).toFixed(2);
        }
    }
    // get preffered
    if (data.payment.online > data.payment.offline) {
        preff.preffPaymentMode = 'Online';
    } else if (data.payment.offline > data.payment.online) {
        preff.preffPaymentMode = 'Offline';
    } else {
        preff.preffPaymentMode = data.payment.online ? 'Online' : 'Offline';
    }

    // get preffered category
    for (const [key, val] of Object.entries(data.category.timesUsed)) {
        if (preff.preffCategory.value < val) {
            preff.preffCategory.key = key;
            preff.preffCategory.value = val;
        }
    }

    // get top 4 tags
    preff.top4Tags = Object.entries(data.usedTags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    // get top 4 category
    const sorted = Object.entries(data.category.moneySpent).sort((a, b) => b[1] - a[1]);
    data.top4Data = sorted.slice(0, 4);
    const deleted = sorted.slice(4);
    let othersTotal = 0;
    if (sorted.length > 4) {
        deleted.forEach(elem => {
            othersTotal += elem[1];
        });
    }
    data.others = othersTotal;
    return { data, preff };
}
// roastUser();
function roastUser() {
    console.log(scores);
}