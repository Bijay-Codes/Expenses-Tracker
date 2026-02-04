import { expenseTags } from "./Data/tags.js";
import { category } from "./Data/category.js";
import { saveToStorage } from "./utility.js";
import { collectiveExpenses } from "./Data/expenses.js";
const expenseForm = document.getElementById('expense-form');
const tagsList = [];
function renderCategory(list, classSelector) {
    const categoryTag = document.querySelector(`.${classSelector}`);
    let html = '';
    list.forEach((category, index) => {
        if (index === 0) {
            html += `<option value="${category}"selected>${category}</option>`
        }
        else {
            html += `<option value="${category}">${category}</option>`
        }
    });
    categoryTag.innerHTML = `<label for="category">Category</label>
                <select name="category">${html}</select>`;
}
function renderTagsPane(list, classSelector) {
    const tagsPane = document.querySelector(`.${classSelector}`);
    let html = '';
    list.forEach(tag => {
        html += `<button type="button"class="tags-button">${tag}</button>`;
    })
    tagsPane.innerHTML = html;
    const tagsButtons = document.querySelectorAll('.tags-button');
    tagsButtons.forEach(button => {
        button.addEventListener('click', () => {
            addToList(button.innerText);
        });
    });
}
function addToList(tag){
    const tagsMap = new Map();
    if(tagsMap.has(tag)){
        deleteFromList(tag);
        renderTagsList('selected-tags')
    }else{
        tagsMap.set(tag);
        tagsList.push(tag);
        renderTagsList('selected-tags');
    };
};
function renderTagsList(classSelector){
    const tagsHtml = document.querySelector(`.${classSelector}`);
    let html = 'Selected Tags (Max 4):';
    tagsList.forEach(tag=>{
        html+=`<span class="tags">${tag}</span>`;
    });
    tagsHtml.innerHTML = html;
}
function deleteFromList(tag){
    tagsList.splice(indexOf(tag),1);
};

renderCategory(category, 'form-category')
renderTagsPane(expenseTags, 'tags-list')
expenseForm.addEventListener('submit', (submit) => {
    submit.preventDefault();
    const data = new FormData(expenseForm);
    const expenseData = Object.fromEntries(data);
    expenseData.id = crypto.randomUUID();
    expenseData.createdAt = Date.now();
    expenseData.tags = tagsList;
    collectiveExpenses.push(expenseData);
    saveToStorage(collectiveExpenses);
});
