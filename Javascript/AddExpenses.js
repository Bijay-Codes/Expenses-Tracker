import { expenseTags } from "./Data/tags.js";
import { category } from "./Data/category.js";
import { saveToStorage, renderCategory, tagsList, renderTagsPane } from "./utility.js";
import { collectiveExpenses } from "./Data/expenses.js";
const expenseForm = document.getElementById('expense-form');
// function renderCategory(list, classSelector) {
//     const categoryTag = document.querySelector(`.${classSelector}`);
//     let html = '';
//     list.forEach((category, index) => {
//         if (index === 0) {
//             html += `<option value="${category}"selected>${category}</option>`
//         }
//         else {
//             html += `<option value="${category}">${category}</option>`
//         }
//     });
//     categoryTag.innerHTML = `<label for="category">Category: </label>
//                 <select name="category">${html}</select>`;
// };


// function renderTagsPane(list, classSelector) {
//     const tagsPane = document.querySelector(`.${classSelector}`);
//     let html = '';
//     list.forEach(tag => {
//         html += `<button type="button"class="tags-button">${tag}</button>`;
//     })
//     tagsPane.innerHTML = html;
//     const tagsButtons = document.querySelectorAll('.tags-button');
//     tagsButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             addToList(button.innerText);
//         });
//     });
// };


// function addToList(tag) {
//     if (tagsList.includes(tag)) {
//         deleteFromList(tag);
//         renderTagsList('selected-tags');
//     } else if (tagsList.length < 4) {
//         tagsList.push(tag);
//         renderTagsList('selected-tags');
//     };
// };
// function renderTagsList(classSelector) {
//     const tagsHtml = document.querySelector(`.${classSelector}`);
//     let html = 'Selected Tags (Max 4):';
//     tagsList.forEach(tag => {
//         html += `<span class="tags">${tag}</span>`;
//     });
//     tagsHtml.innerHTML = html;
// };
// function deleteFromList(tag) {
//     tagsList.splice(tagsList.indexOf(tag), 1);
// };
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
    expenseData.createdAt = Date.now()-25*60*60*1000;
    expenseData.tags = tagsList;
    if (expenseData.checkbox_datetime === 'on') {
        expenseData.datetime = dayjs(expenseData.createdAt).format('YYYY-MM-DDTHH:mm');
    };
    collectiveExpenses.unshift(expenseData);
    saveToStorage(collectiveExpenses, 'expenses');
    submit.target.reset();
    tagsList.length = 0;
    renderTagsPane(expenseTags, 'tags-list');
});
