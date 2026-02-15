import { expenseTags } from "./Data/tags.js";
import { category } from "./Data/category.js";
import { saveToStorage, renderCategory, tagsList, renderTagsPane } from "./utility.js";
import { collectiveExpenses } from "./Data/expenses.js";
import { scores } from "./Data/RoastData.js";
const expenseForm = document.getElementById('expense-form');
function checkCustomDate() {
    const checkbox = document.querySelector('.checkbox-current-datetime ');
    const customDateTime = document.querySelector('.date-time-input');
    checkbox.addEventListener('click', () => {
        if (checkbox.checked) {
            customDateTime.innerHTML = ''
        }
        else {
            customDateTime.innerHTML = `<label for="datetime">Date & Time: </label>
                    <input type="datetime-local" class="datetime inputs" name="datetime" required>`
        }
    })
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
    expenseData.tags = tagsList;
    if (expenseData.checkbox_datetime === 'on') {
        expenseData.datetime = dayjs(expenseData.createdAt).format('YYYY-MM-DDTHH:mm');
    };
    collectiveExpenses.unshift(expenseData);
    scores.addCount++;
    saveToStorage(scores,'scores');
    console.log(scores);
    saveToStorage(collectiveExpenses, 'expenses');
    submit.target.reset();
    tagsList.length = 0;
    renderTagsPane(expenseTags, 'tags-list');
});