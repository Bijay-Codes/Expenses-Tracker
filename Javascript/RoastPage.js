import "https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js";
import { renderMonths, renderYearFilter, filterByMonth, formatDate } from "./utility.js";
import { analyzeExpenses, getRoastTier2, generateSummaryRoast, resetData, tier1Id } from "./Data/RoastData.js";
import { redFlagTags, roastParameters, redFlagCategory } from "./Data/Roastbase.js";
renderMonths('filter-selector');
renderYearFilter('filter-selector-year');
let filterData = filterByMonth();
let tier2Id;
const month = document.querySelector('.filter-selector');
const year = document.querySelector('.filter-selector-year');

month.addEventListener('change', () => {
    updateRoast();
});
year.addEventListener('change', () => {
    updateRoast();
});
function updateRoast() {
    const filterData = filterByMonth();
    if (filterData.length === 0) {
        resetData();
        document.querySelector('.statusbox').innerText = "No data for this month 💀";
        document.querySelector('.hall-of-shame').innerText = '';
        document.querySelector('.monthly-roast-static').innerText = ''
        return;
    }
    clearTimeout(tier2Id);
    resetData();
    const dataForRoast = analyzeExpenses(filterData);
    hallOfShameExpend(filterData, 'hall-of-shame');
    timedRoast('statusbox', dataForRoast);
    generateSummaryRoast(dataForRoast.data, dataForRoast.preff, redFlagTags, 'monthly-roast-static');
};

const dataForRoast = analyzeExpenses(filterData);
function setTagline() {
    const today = dayjs();
    const tagline = document.querySelector('.tagline');
    tagline.innerText = `Enjoying your ${today.format('dddd')}? Im here to ruin it 🔥.`;
};
function hallOfShameExpend(filterData, classSelector) {
    let allExpenseMap = new Map();
    let scoreExpense = {};
    let selectedExpense = {};
    filterData.forEach(data => {
        data.tags.forEach(tag => {
            const cleanTag = tag.replace(/(\p{Extended_Pictographic}|\p{Emoji_Component})/gu, '').trim();
            if (redFlagTags.includes(cleanTag)) {
                scoreExpense[data.id] ? scoreExpense[data.id]++ : scoreExpense[data.id] = 1;
            };
        });
        allExpenseMap.set(data.id, data);
    });
    scoreExpense = Object.entries(scoreExpense).sort((a, b) => b[1] - a[1]).slice(0, 1).map(data => data[0]);
    selectedExpense = allExpenseMap.get(scoreExpense[0]);
    if (!selectedExpense) {
        return;
    }
    renderBadData(selectedExpense, classSelector);
};
function renderBadData(elem, classSelector) {
    const seletor = document.querySelector(`.${classSelector}`);
    let html = `<div class="monthly-expense"><span class="heading">Hall Of Shame...</span> This might be the worst expense you have made this Month.</div>
                <div class="expense-header">
                    <span class="expense-category main">${elem.category}⇒</span>
                    <span class="expense-amount main">₹${elem.amount}</span>
                    </div>
                    <div class="expense-body">
                    <span class="expense-tags main">${elem.tags.join(' — ')}</span>
                    <p class="expense-comment main">Comment › ${elem.comment === '' || elem.comment === ' ' ? 'Soo ashamed to even put a comment 👌' : elem.comment}</p>
                    <span class="expense-date-time secondary">${formatDate(elem.datetime)}</span>
                    <span class="expense-mode online secondary">${elem.paymentMode === '0' ? 'Online' : 'Offline'} Payment</span>
                </div>`;
    seletor.innerHTML = html;
};
setTagline();
hallOfShameExpend(filterData, 'hall-of-shame');
timedRoast('statusbox', dataForRoast);
generateSummaryRoast(dataForRoast.data, dataForRoast.preff, redFlagTags, 'monthly-roast-static');

function timedRoast(classSelector, currentData) {
    const selector = document.querySelector(`.${classSelector}`);
    clearTimeout(tier2Id);
    getRoastTier2(currentData.preff, 'statusbox');
    setRecursiveTime(selector, getRoastTier2, currentData);
};
function setRecursiveTime(selector, callback, currentData) {
    let randDuration = Math.floor(Math.random() * roastParameters.maxTime) + roastParameters.minTime;
    tier2Id = setTimeout(() => {
        selector.innerHTML = callback(currentData.preff, 'statusbox');
        setRecursiveTime(selector, callback, currentData);
    }, randDuration * 1000);
};