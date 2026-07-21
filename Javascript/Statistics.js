import { collectiveExpenses } from "./Data/expenses.js";
import { filterByMonth, renderYearFilter, renderMonths } from "./utility.js";
import { analyzeExpenses, data, preff, resetData } from "./Data/RoastData.js";
const chartContainer = document.querySelector('.stats-charts');
const statsPane = document.querySelector('.stats-pane');

const DOMS = {
    totalAmt: document.querySelector('.total-spent'),
    tagsSection: document.querySelector('.payment-category'),
    paymentMode: document.querySelector('.payment-mode'),
    categorySection: document.querySelector('.payment-per-category'),
    top4Tags: document.querySelector('.top-4-tags'),
    statusbox: document.querySelector('.statusbox')
};
renderMonths('filter-selector');
let filterData = filterByMonth();
function clearAllStats() {
    resetData();
    chartContainer.classList.add('collapse');
    statsPane.classList.add('collapse');
    chartContainer.innerHTML = '';
};
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
renderYearFilter('filter-selector-year');

function reRenderStats() {
    const input = document.querySelector('.filter-selector');
    const yearInp = document.querySelector('.filter-selector-year');
    input.addEventListener('change', () => {
        renderStats();
    });
    yearInp.addEventListener('change', () => {
        renderStats();
    });
};
renderStats();
function renderStats() {
    filterData = filterByMonth();
    clearAllStats();
    if (chartContainer.classList.contains('collapse')) {
        chartContainer.classList.remove('collapse');
        statsPane.classList.remove('collapse');
    }

    if (filterData.length === 0) {
        DOMS.statusbox.innerText = 'No Transactions found for this particual month. ◑﹏◐ ';
        clearAllStats();
        return;
    }
    else {
        chartContainer.innerHTML = `<canvas id="category-charts"></canvas>`;
        DOMS.statusbox.innerText = '';
    }
    analyzeExpenses(filterData);
    drawCategoryChart();
    top4tags();
    paymentPerCategory();
    totalAmount();
    paymentCategory();
    paymentMode();
};
function totalAmount() {
    DOMS.totalAmt.innerHTML = `<span class="main-text">Total Amount ⇒ </span><span class="amount values">₹${data.totalAmt}</span>`;
};
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
};
function paymentPerCategory() {
    const perCategory = document.querySelector('.payment-per-category');
    let html = '';
    for (let [key, val] of Object.entries(data.category.timesUsed)) {
        html += `<div class="category-sec"><span class="category-name">${key}</span><span class="times-used">${val}x</span></div>`;
    }
    perCategory.innerHTML = html;
};
function top4tags() {
    const tags = document.querySelector('.top-4-tags');
    let html = '';
    preff.top4Tags.forEach(tag => {
        html += `<div class="tag-chip">${tag[0]} <span class="times-used">${tag[1]}x</span></div>`;
    })
    tags.innerHTML = html;
};
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
                            let data = chart.data;
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
};
function getDataForChart() {
    const chartData = [];
    const labels = [];
    const color = [];
    data.top4Data.forEach(categoryData => {
        chartData.push(categoryData[1]);
        labels.push(categoryData[0]);
        color.push(categoryColors[categoryData[0]]);
    })
    if (data.others > 0) {
        chartData.push(data.others);
        labels.push('Others');
        color.push('#475569')
    }
    return { chartData, labels, color }
};