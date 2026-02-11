import { collectiveExpenses } from "./Data/expenses.js";
import { filterByMonth } from "./utility.js";
let filterData = filterByMonth();
const DOMS = {
    totalAmt: document.querySelector('.total-spent'),
    paymentSection: document.querySelector('.payment-section'),
    categorySection: document.querySelector('.category-section'),
    tagsSection: document.querySelector('.tags-section'),
    allTags: document.querySelector('.all-tags-used'),
    statusbox: document.querySelector('.statusbox')
};
function clearAllStats() {
    DOMS.totalAmt.innerHTML = '';
    DOMS.paymentSection.innerHTML = '';
    DOMS.categorySection.innerHTML = '';
    DOMS.tagsSection.innerHTML = '';
    DOMS.allTags.innerHTML = '';
}
reRenderStats();
function reRenderStats() {
    const input = document.querySelector('.filter-selector');
    input.addEventListener('change', () => {
        renderStats();
    });
}
renderStats();
function renderStats() {
    filterData = filterByMonth();

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
    if (filterData.length === 0) {
        DOMS.statusbox.innerText = 'No Transactions found for this particual month.';
        clearAllStats();
        return;
    }
    else {
        DOMS.statusbox.innerText = '';
    }
    getValues();
    getPercent();
    getMostPreferred();
    totalAmt(DOMS.totalAmt);
    paymentSection(DOMS.paymentSection);
    categorySection(DOMS.categorySection);
    top4Tags(DOMS.tagsSection);
    tagsSection(DOMS.allTags);
    function getValues() {
        let total = 0;
        filterData.forEach(exp => {
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
    function getPercent() {
        onlinePercent = (data.payment.paymentOnline / data.totalAmt * 100).toFixed(2);
        offlinePercent = (data.payment.paymentOffline / data.totalAmt * 100).toFixed(2);
        categoryPercent = {};
        for (const [key, value] of Object.entries(data.category.moneySpent)) {
            categoryPercent[key] = (value / data.totalAmt * 100).toFixed(2);
        };
    };
    function getMostPreferred() {
        if (data.payment.online && data.payment.offline) {
            if (data.payment.online > data.payment.offline) {
                preff.preffPaymentMode = 'Online';
            }
            else {
                preff.preffPaymentMode = 'Offline';
            }
        }
        else {
            preff.preffPaymentMode = data.payment.online ? 'Online' : 'Offline' || data.payment.offline ? 'Offline' : 'Online';
        }
        for (const [key, val] of Object.entries(data.category.timesUsed)) {
            if (preff.preffCategory.value < val) {
                preff.preffCategory.key = key;
                preff.preffCategory.value = val;
            };
        };
        preff.top4 = Object.entries(data.usedTags).sort((a, b) => b[1] - a[1]).slice(0, 4);
    };
    function totalAmt(domClass) {
        domClass.innerText = `The Total of All Your Expenses is ₹${data.totalAmt}`;
    };
    function paymentSection(domClass) {
        domClass.innerHTML = `<div class="preffered-mode">Your Most Preffered Payment Mode is ${preff.preffPaymentMode}
    Payment (${preff.preffPaymentMode === "Online" ? data.payment.online : data.payment.offline} Times total)</div>
    <div class="online-spent">You Spent a Total of 
    ₹${data.payment.paymentOnline} By Online Payment (About ${onlinePercent}% of Transactions)</div>
    <div class="offline-spent">You Spent a Total of 
    ₹${data.payment.paymentOffline} By Offline Payment (About ${offlinePercent}% of Transactions)</div>
    `
    };
    function categorySection(domClass) {
        let html = '';
        for (const [category, value] of Object.entries(data.category.moneySpent)) {
            html += `<div class="category-pane">${category} ₹${value} 
        (${data.category.timesUsed[category]} Times 
        and ${categoryPercent[category]}%)</div>`;
        }
        domClass.innerHTML = html;
    };
    function top4Tags(domClass) {
        let html = 'Your 4 Most Used Tags';
        preff.top4.forEach(pair => {
            html += `<div class="top-4-tags">${pair[0]}: (${pair[1]} Times Used)</div>`;
        })
        domClass.innerHTML = html;
    }
    function tagsSection(domClass) {
        let html = '<div>All Tags Used by You</div>';
        for (const [key, val] of Object.entries(data.usedTags)) {
            html += `<span class="tags-used">${key} : ${val}</span>`;
        };
        domClass.innerHTML = html;
    };

}
