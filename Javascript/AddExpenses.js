import "https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js";
import { expenseTags } from "./Data/tags.js";
import { category } from "./Data/category.js";
import { saveToStorage, renderCategory, tagsList, renderTagsPane } from "./utility.js";
import { collectiveExpenses } from "./Data/expenses.js";
import { scores, loadAddPageRoasts } from "./Data/RoastData.js";
const expenseForm = document.getElementById('expense-form');
const statusbox = document.querySelector('.statusbox');
function checkCustomDate() {
    const checkbox = document.querySelector('.checkbox-current-datetime ');
    const customDateTime = document.querySelector('.date-time-input');
    checkbox.addEventListener('click', () => {
        if (checkbox.checked) {
            customDateTime.classList.add('hidden');
            customDateTime.querySelector('input').removeAttribute('required');
        } else {
            customDateTime.classList.remove('hidden');
            customDateTime.querySelector('input').setAttribute('required', 'required');
        };
    });
};
renderCategory(category, 'category-list');
renderTagsPane(expenseTags, 'tags-list');
checkCustomDate();
expenseForm.addEventListener('submit', (submit) => {
    submit.preventDefault();
    const data = new FormData(expenseForm);
    const expenseData = Object.fromEntries(data);
    expenseData.id = crypto.randomUUID();
    expenseData.createdAt = Date.now();
    expenseData.tags = [...tagsList];
    if (expenseData.checkbox_datetime === 'on') {
        expenseData.datetime = dayjs(expenseData.createdAt).format('YYYY-MM-DDTHH:mm');
    };
    collectiveExpenses.unshift(expenseData);
    document.querySelector('.date-time-input').classList.remove('hidden');
    scores.addCount++;
    saveToStorage(scores, 'scores');
    saveToStorage(collectiveExpenses, 'expenses');
    submit.target.reset();
    document.querySelector('.checkbox-current-datetime').checked = false;
    document.querySelector('.date-time-input input').setAttribute('required', 'required');
    tagsList.length = 0;
    renderTagsPane(expenseTags, 'tags-list');
    loadAddPageRoasts('statusbox', expenseData);
});
expenseForm.addEventListener('change', () => {
    statusbox.innerHTML = ''
})

