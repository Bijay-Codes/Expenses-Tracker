import { expenseTags } from "./Data/tags.js";
import { category } from "./Data/category.js";

function renderCategory(list, classSelector) {
    const categoryTag = document.querySelector(`.${classSelector}`);
    let html = '';
    list.forEach((category, index) => {
        if (index === 0) {
            html += `<option value="${category}"selected>${category}</option>`
        }
        else{
        html += `<option value="${category}">${category}</option>`
        }
    });
    categoryTag.innerHTML = `<label for="category">Category</label>
                <select name="category">${html}</select>`;
}
function renderTagsPane(list, classSelector) {
    const tagsPane = document.querySelector(`.${classSelector}`);
    let html = '';
    list.forEach(tag=>{
        html+=`<button class="tags-button">${tag}</button>`;
    })
    tagsPane.innerHTML = html;
}
renderCategory(category, 'form-category')
renderTagsPane(expenseTags,'tags-list')
const expenseForm = document.getElementById('expense-form');
expenseForm.addEventListener('submit', (submit) => {
    submit.preventDefault();
    const data = new FormData(expenseForm);
    const expenseData = Object.fromEntries(data);
    console.log(expenseData);
});