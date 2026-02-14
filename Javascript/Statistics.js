import { collectiveExpenses } from "./Data/expenses.js";
import { filterByMonth, oldestAndLatestExpense } from "./utility.js";
let filterData = filterByMonth();
const statCharts = document.getElementById('category-charts');
const DOMS = {
    totalAmt: document.querySelector('.total-spent'),
    tagsSection: document.querySelector('.payment-category'),
    paymentMode: document.querySelector('.payment-mode'),
    categorySection: document.querySelector('.payment-per-category'),
    top4Tags: document.querySelector('.top-4-tags'),
    allTags: document.querySelector('.all-tags'),
    statusbox: document.querySelector('.statusbox')
};
const chartContainer = document.querySelector('.stats-charts');
const statsPane = document.querySelector('.stats-pane');

function clearAllStats() {
    chartContainer.classList.add('collapse');
    statsPane.classList.add('collapse');
}
const categoryColors = {
    'Groceries 🛒': '#10b981',
    'Restaurants & Takeout 🍕': '#ef4444',
    'Coffee & Snacks ☕': '#f59e0b',
    'Transportation 🚙': '#6b7280',
    'Gas & Fuel ⛽': '#fbbf24',
    'Housing 🏠': '#5865f2',
    'Utilities ⚡': '#fde047',
    'Phone & Internet 📡': '#a78bfa',
    'Subscriptions 📺': '#ec4899',
    'Healthcare 💊': '#06b6d4',
    'Fitness & Wellness 💪': '#14b8a6',
    'Insurance 🛡️': '#64748b',
    'Personal Care 💇‍♀️': '#f472b6',
    'Clothing & Shoes 👟': '#c084fc',
    'Tech & Electronics 💻': '#8b5cf6',
    'Entertainment 🎮': '#f43f5e',
    'Hobbies 🎨': '#fb923c',
    'Travel ✈️': '#38bdf8',
    'Gifts 🎁': '#fb7185',
    'Pets 🐕': '#fcd34d',
    'Education & Learning 📚': '#34d399',
    'Financial 💳': '#dc2626'
};
reRenderStats();
renderYearFilter();

function reRenderStats() {
    const input = document.querySelector('.filter-selector');
    const yearInp = document.querySelector('.filter-selector-year');
    input.addEventListener('change', () => {
        clearAllStats();
        renderStats();
    });
    yearInp.addEventListener('change', () => {
        clearAllStats();
        renderStats();
    });
};
renderStats();
function renderStats() {
    filterData = filterByMonth();
    chartContainer.innerHTML = `<canvas id="category-charts"></canvas>`;
    if (chartContainer.classList.contains('collapse')) {
        chartContainer.classList.remove('collapse');
        statsPane.classList.remove('collapse');
    }
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
        DOMS.statusbox.innerText = 'No Transactions found for this particual month. 😔';
        clearAllStats();
        return;
    }
    else {
        DOMS.statusbox.innerText = '';
    }
    getValues();
    getPercent();
    getMostPreferred();
    totalAmount();
    paymentCategory();
    paymentMode();
    paymentPerCategory();
    top4tags();
    top4Category();
    drawCategoryChart();
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

    function totalAmount() {
        DOMS.totalAmt.innerHTML = `<span class="main-text">Total Amount ⇒ </span><span class="amount values">₹${data.totalAmt}</span>`;
    }
    function paymentCategory() {
        const mostSpent = document.querySelector('.most-spent-category');
        const mostUsed = document.querySelector('.most-used-category');
        let highestSpentCategory = 0;
        let spentKey;
        for (const [key, val] of Object.entries(data.category.moneySpent)) {
            if (highestSpentCategory < val) {
                spentKey = key;
                highestSpentCategory = val;
            };
        };
        mostSpent.innerHTML = `<span class="category-key keys">${spentKey}</span> — <span class="category-value values">₹ ${highestSpentCategory}</span>`;
        mostUsed.innerHTML = `<span class="category-key keys">${preff.preffCategory.key}</span> — <span class="category-value times-used">${preff.preffCategory.value}x</span>`;
    };
    function paymentMode() {
        const payment = document.querySelector('.payment-mode');
        payment.innerHTML = `<span class="preffered-mode">Preffered Payment Mode ⇒ ${preff.preffPaymentMode} Payment
         </div> (Online • <span class="times-used">${data.payment.online}</span> Offline • <span class="times-used">${data.payment.offline}</span>)`;
    }
    function paymentPerCategory() {
        const perCategory = document.querySelector('.payment-per-category');
        let html = '';
        for (let [key, val] of Object.entries(data.category.timesUsed)) {
            html += `<div class="category-sec">${key} • <span class="times-used">${val}x</span></div>`;
        }
        perCategory.innerHTML = html;
    }
    function top4tags() {
        const tags = document.querySelector('.top-4-tags');
        let html = '<div class="tags-heading">Top 4 Tags </div>'
        preff.top4.forEach(tag => {
            html += `<div class="tag">${tag[0]} (<span class="times-used">${tag[1]}x</span>)</div>`;
        })
        tags.innerHTML = html;
    }
    function top4Category() {
        const sorted = Object.entries(data.category.moneySpent).sort((a, b) => b[1] - a[1]);
        let top4 = sorted.slice(0, 4);
        const deleted = sorted.slice(4);
        let othersTotal = 0;
        if (sorted.length > 4) {
            deleted.forEach(elem => {
                othersTotal += elem[1];
            });
        }
        data.category.others = othersTotal;
        data.category.top4Data = top4;
    }
    function drawCategoryChart() {
        const ctx = document.getElementById('category-charts');
        const chartData = getDataForChart();
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Money Spent',
                    data: chartData.chartData,
                    backgroundColor: chartData.color,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            color: '#f9fafb',
                            font: {
                                family: 'DM Sans',
                                size: 13
                            },
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label} • ₹${data.datasets[0].data[i]}`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    fontColor: '#f9fafb',
                                    hidden: false,
                                    index: i
                                }));
                            }
                        }
                    }
                }
            }
        });
    }
    function getDataForChart() {
        const chartData = [];
        const labels = [];
        const color = [];
        data.category.top4Data.forEach(categoryData => {
            chartData.push(categoryData[1]);
            labels.push(categoryData[0]);
            color.push(categoryColors[categoryData[0]]);
        })
        if (data.category.others > 0) {
            chartData.push(data.category.others);
            labels.push('Others');
            color.push('#475569')
        }
        return { chartData, labels, color }
    }
}
function renderYearFilter() {
    if (collectiveExpenses.length !== 0) {
        const format = oldestAndLatestExpense();
        const yearFilter = document.querySelector('.filter-selector-year');
        let html = '';
        for (let i = format.oldest; i < format.latest + 1; i++) {
            html += `<option value="${i}"${i === Number(dayjs().format('YYYY')) ? 'selected' : ''}>${i}</option>`
        };
        yearFilter.innerHTML = html;
    }
}
