import { collectiveExpenses } from "./Data/expenses.js";
const DOMS = {
    totalAmt: document.querySelector('.total-spent'),
    paymentSection: document.querySelector('.payment-section'),
    categorySection: document.querySelector('.category-section'),
    tagsSection: document.querySelector('.tags-section'),
    allTags: document.querySelector('.all-tags-used')
};
const data = {
    totalAmt: 0,
    payment: {
        paymentOnline: 0,
        paymentOffline: 0
    },
    category: {
        moneySpent: {},
        timesUsed: {}
    },
    usedTags: {},
};
const preff = {
    preffPaymentMode: '',
    preffCategory: {
        key: '',
        value: 0
    },
};
let onlinePercent;
let offlinePercent;
let categoryPercent;

getValues();
function getValues() {
    let total = 0;
    collectiveExpenses.forEach(exp => {
        total += Number(exp.amount);
        paymentSummary(exp.paymentMode === '0' ? 'online' : 'offline', Number(exp.amount));
        getCategory(exp.category, Number(exp.amount));
        getTags(exp.tags)
    });
    data.totalAmt = total;
};
function paymentSummary(mode, amount) {
    if (mode === 'online') {
        data.payment.paymentOnline += amount;
        if (!data.payment[mode]) {
            data.payment[mode] = 1;
        } else {
            data.payment[mode]++;
        };
    }
    else {
        data.payment.paymentOffline += amount
        if (!data.payment[mode]) {
            data.payment[mode] = 1;
        } else {
            data.payment[mode]++;
        };
    };
};
function getCategory(category, amount) {
    if (!data.category.timesUsed[category]) {
        data.category.moneySpent[category] = amount;
        data.category.timesUsed[category] = 1;
    }
    else {
        data.category.moneySpent[category] += amount;
        data.category.timesUsed[category]++;
    };
};
function getTags(tags) {
    tags.forEach(tag => {
        if (!data.usedTags[tag]) {
            data.usedTags[tag] = 1;
        }
        else {
            data.usedTags[tag]++;
        };
    });
};
getPercent();
function getPercent() {
    onlinePercent = (data.payment.paymentOnline / data.totalAmt * 100).toFixed(2);
    offlinePercent = (data.payment.paymentOffline / data.totalAmt * 100).toFixed(2);
    categoryPercent = {};
    for (const [key, value] of Object.entries(data.category.moneySpent)) {
        categoryPercent[key] = (value / data.totalAmt * 100).toFixed(2);
    };
};
getMostPreferred();
function getMostPreferred() {
    if (data.payment.online > data.payment.offline) {
        preff.preffPaymentMode = 'Online';
    }
    else if (data.payment.paymentOffline > data.payment.paymentOnline) {
        preff.preffPaymentMode = 'Offline';
    }
    else {
        preff.preffPaymentMode = 'LOL both are Equal';
    };
    for (const [key, val] of Object.entries(data.category.timesUsed)) {
        if (preff.preffCategory.value < val) {
            preff.preffCategory.key = key;
            preff.preffCategory.value = val;
        };
    };
    preff.top4 = Object.entries(data.usedTags).sort((a, b) => b[1] - a[1]).slice(0, 4);
};

totalAmt(DOMS.totalAmt);
function totalAmt(domClass) {
    domClass.innerText = `The Total of All Your Expenses is ₹${data.totalAmt}`;
};
paymentSection(DOMS.paymentSection);
function paymentSection(domClass) {
    domClass.innerHTML = `<div class="preffered-mode">Your Most Preffered Payment Mode is ${preff.preffPaymentMode}
    Payment (${preff.preffPaymentMode === "Online" ? data.payment.online : data.payment.offline} Times total)</div>
    <div class="online-spent">You Spent a Total of 
    ₹${data.payment.paymentOnline} By Online Payment (About ${onlinePercent}% of Transactions)</div>
    <div class="offline-spent">You Spent a Total of 
    ₹${data.payment.paymentOffline} By Online Payment (About ${offlinePercent}% of Transactions)</div>
    `
};
categorySection(DOMS.categorySection);
function categorySection(domClass) {
    let html = '';
    for (const [category, value] of Object.entries(data.category.moneySpent)) {
        html += `<div class="category-pane">${category} ₹${value} 
        (${data.category.timesUsed[category]} Times 
        and ${categoryPercent[category]}%)</div>`;
    }
    domClass.innerHTML = html;
};
top4Tags(DOMS.tagsSection);
function top4Tags(domClass) {
    let html = 'Your 4 Most Used Tags';
    preff.top4.forEach(pair => {
        html += `<div class="top-4-tags">${pair[0]}: (${pair[1]} Times Used)</div>`;
    })
    domClass.innerHTML = html;
}
tagsSection(DOMS.allTags);
function tagsSection(domClass) {
    let html = '<div>All Tags Used by You</div>';
    for (const [key, val] of Object.entries(data.usedTags)) {
        html += `<span class="tags-used">${key} : ${val}</span>`;
    };
    domClass.innerHTML = html;
};
