import { collectiveExpenses } from "./expenses.js";
import { getRoast, roastParameters, getRoastByTags, monthlyRoast, getAddPageRoasts } from "./Roastbase.js";
import { loadFromStorage } from "../utility.js";
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
let userTier = '';
let addId = '';
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
export let tier1Id;

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
};

// determines if the user is already familiar with how this site works or not.
// newbie = completely new. mediocre = somewhat familiar. pro = already knows how this site works.
function getUserTier() {
    if (collectiveExpenses.length <= roastParameters.userTier) {
        userTier = 'newbie';
    } else if (collectiveExpenses.length <= Math.floor(roastParameters.userTier * 1.5)) {
        userTier = 'mediocre';
    } else {
        userTier = 'pro';
    }
};

/* edit / add this represents the frequency of the users 
adding and editing expenses. higher it is the more the user is editing rather than adding the expenses
or lying to the system if low this proves the user is truthfull but doesnt justify if it good lol.
*/
// delete/add
// edit+delete/add
// add
function getRoastTier1() {
    getUserTier();
    if (userTier === 'newbie'
        && (scores.addCount === 0
            || scores.deleteCount === 0
            || scores.editCount === 0)) {
        return 'Keep Going. You Survive... For now. 🔥 ';
    };
    const ratio = {
        EditbyAdd: 0,
        DeletebyAdd: 0,
        EditDeletebyAdd: 0
    };
    getRatios();
    function getRatios() {
        ratio.EditbyAdd = (scores.editCount / scores.addCount)
        ratio.DeletebyAdd = (scores.deleteCount / scores.addCount)
        ratio.EditDeletebyAdd = ((scores.editCount + scores.deleteCount) / scores.addCount);
        return ratio;
    };
    let randomNum = roastParameters.specificRoast || Math.floor(Math.random() * 3) + 1;
    if (randomNum === 1) {
        // for users that edit more than adding.
        if (ratio.EditbyAdd <= roastParameters.tier1.indecisive) {
            return getRoast(1, 'EditbyAdd', ratio, scores);
        } else if (ratio.EditbyAdd <= roastParameters.tier2.indecisive) {
            return getRoast(2, 'EditbyAdd', ratio, scores);
        } else if (ratio.EditbyAdd > roastParameters.tier3.indecisive) {
            return getRoast(3, 'EditbyAdd', ratio, scores);
        };
    } else if (randomNum === 2) {
        // for users that delete more than add.
        if (ratio.DeletebyAdd <= roastParameters.tier1.deleter) {
            return getRoast(1, 'DeletebyAdd', ratio, scores);
        } else if (ratio.DeletebyAdd <= roastParameters.tier2.deleter) {
            return getRoast(2, 'DeletebyAdd', ratio, scores);
        } else if (ratio.DeletebyAdd >= roastParameters.tier3.deleter) {
            return getRoast(3, 'DeletebyAdd', ratio, scores);
        };
    } else if (randomNum === 3) {
        // for chaotic users.
        if (ratio.EditDeletebyAdd <= roastParameters.tier1.chaos) {
            return getRoast(1, 'EditDeletebyAdd', ratio, scores);
        } else if (ratio.EditDeletebyAdd <= roastParameters.tier2.chaos) {
            return getRoast(2, 'EditDeletebyAdd', ratio, scores);
        } else if (ratio.EditDeletebyAdd > roastParameters.tier2.chaos) {
            return getRoast(3, 'EditDeletebyAdd', ratio, scores);
        };
    } else {
        return `Dumbass the limit was 3 😒 did you forget or just testing...`;
    };
};
// this tier1 only includes the roasts by using edit counts, add counts and delelte counts.
export function loadRoastsTier1(classSelector) {
    const selector = document.querySelector(`.${classSelector}`);
    stopRoasts();
    selector.innerHTML = getRoastTier1();
    recursiveTimeout(selector, getRoastTier1)
};

function recursiveTimeout(selector, callback) {
    let randDuration = Math.floor(Math.random() * roastParameters.maxTime) + roastParameters.minTime;
    tier1Id = setTimeout(() => {
        selector.innerHTML = callback();
        recursiveTimeout(selector, callback);
    }, randDuration * 1000)
};
export function stopRoasts() {
    clearTimeout(tier1Id);
};
export function getRoastTier2(preff, classSelector) {
    const selector = document.querySelector(`.${classSelector}`);
    const roastsTags = getRoastByTags(preff);
    if (roastsTags.length !== 0) {
        const randomTag = generateRandNum(0, roastsTags.length);
        let roast = '';
        if (roastsTags[randomTag].times <= 3) {
            roast = roastsTags[randomTag].tier1[generateRandNum(0, roastsTags[randomTag].tier1.length)];
        } else if (roastsTags[randomTag].times < 6) {
            roast = roastsTags[randomTag].tier2[generateRandNum(0, roastsTags[randomTag].tier2.length)];
        } else if (roastsTags[randomTag].times >= 6) {
            roast = roastsTags[randomTag].tier3[generateRandNum(0, roastsTags[randomTag].tier3.length)];
        };
        selector.innerText = roast;
        return roast;
    } else {
        selector.innerText = 'Good Actually. No Bad Tags Found 👍.'
        return 'Good Actually. No Bad Tags Found 👍.';
    }
};
function generateRandNum(min, max) {
    return Math.floor(Math.random() * max) + min;
};

export function generateSummaryRoast(data, preff, roastTags, classSelector) {
    let count = 0;
    let isBad = false;
    const selector = document.querySelector(`.${classSelector}`);
    for (let i = 0; i < preff.top4Tags.length; i++) {
        let cleanTag = preff.top4Tags[i][0].replace(/(\p{Extended_Pictographic}|\p{Emoji_Component})/gu, '').trim();
        if (roastTags.includes(cleanTag)) {
            count++;
        };
    };
    if (count < 1) {
        return;
    } else {
        isBad = true;
    };
    monthlyRoast(data, preff, isBad, selector);
};

export function loadAddPageRoasts(classSelector, logData) {
    const selector = document.querySelector(`.${classSelector}`);
    selector.innerText = '';
    clearTimeout(addId);
    addId = setTimeout(() => {
        selector.innerText = '';
    }, roastParameters.minTime * 1000);
    selector.innerHTML = getAddPageRoasts(logData);
}
