import { saveToStorage, formatDate, filterByMonth, renderCategory, renderTagsPane, tagsList, renderTagsList } from "./utility.js"
import { collectiveExpenses } from "./Data/expenses.js"
import { category } from "./Data/category.js";
import { expenseTags } from "./Data/tags.js";
let editId = '';
function renderExpenses() {
    const tagsPane = document.querySelector('.expenses-pane');
    let filteredData = filterByMonth();
    let html = '';
    filteredData.forEach(elem => {
        html += `<div class="expense-card">
            <div class="expense-header">
                <span class="expense-category">${elem.category}</span>
                <span class="expense-amount">₹${elem.amount}</span>
            </div>

            <div class="expense-body">
                <span class="expense-date-time">${formatDate(elem.datetime)}</span>
                <span class="expense-mode online">${elem.paymentMode === '0' ? 'Online' : 'Offline'} Payment</span>
            </div>
            <p class="expense-comment">
                ${elem.comment}
            </p>
            <span class="expense-tags">${elem.tags}</span>
            <div class="card-buttons">${renderButtons(elem.createdAt, elem.id)}</div>
        </div>`
    });
    tagsPane.innerHTML = html;
};
function reRenderExpenses() {
    const input = document.querySelector('.filter-selector');
    input.addEventListener('change', () => {
        renderExpenses();
    })
}
reRender();
function reRender() {
    renderExpenses();
    reRenderExpenses();
    renderEditPane();
    addClassToForm();
    renderCategory(category, 'category-list');
    renderTagsPane(expenseTags, 'tags-list')
    submitButton();
    deleteBtn();
};
//renderEditPaneCategory();
function isLocked(timeCreated) {
    const lockTime = 24 * 60 * 60 * 1000
    return Date.now() - timeCreated > lockTime;
};
function renderButtons(timeCreated, id) {
    if (isLocked(timeCreated)) {
        return `<button type="button" class="locked">Edit 🔒</button>
            <button type="button" class="locked">Delete 🔒</button>`
    }
    else {
        return `<button class="edit-button"data-expense-id="${id}">Edit</button>
            <button class="delete-button"data-expense-id="${id}">Delete</button>`
    };
};
function addClassToForm() {
    const editPane = document.getElementById('edit-pane');
    const buttons = document.querySelectorAll('.visibility-buttons');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            editPane.classList.add('hidden');
            editPane.classList.remove('editing');
        });
    });
};

function renderEditPane() {
    const editButton = document.querySelectorAll('.edit-button');
    const editPane = document.getElementById('edit-pane');
    editButton.forEach(btn => {
        btn.addEventListener('click', () => {
            editId = btn.dataset.expenseId;
            addOldData();
            editPane.classList.remove('hidden');
            editPane.classList.add('editing');
        });
    });
};

function submitButton() {
    const btn = document.querySelector('.submit-button');
    btn.addEventListener('click', () => {
        const editData = getValuesFromEditPane();
        collectiveExpenses.forEach(exp => {
            if (exp.id === editId) {
                Object.assign(exp, editData);
                saveToStorage(collectiveExpenses, 'expenses');
            };
        });
        reRender();
    });
};
/* notice i could have rendered the category and tags using just 1 for loop  or just 
have copy pasted it but well it will just be a pain to write the code again and its not a good
practice to write the same code 2 times manually... 
Also i want to categorize what each function does rather than doing 2 tasks i prefer that the
function does just 1 task that its given correctly and also in my opinion it will help me in
debugging in some way or if i want to change something i wont break multiple stuff.
*/
function addOldData() {
    const oldData = getEditingExpense(editId);
    const inputs = document.querySelectorAll('.inputs');
    tagsList.length = 0;
    oldData.tags.forEach(tag => {
        tagsList.push(tag);
    });
    inputs.forEach(inp => {
        let dataset = inp.dataset.inputType;
        if (dataset === 'amount') {
            inp.value = oldData.amount;
        }
        else if (dataset === 'category') {
            inp.value = oldData.category;
        }
        else if (dataset === 'datetime') {
            inp.value = oldData.datetime;
        }
        else if (dataset === 'payment-mode') {
            inp.value = oldData.paymentMode;
        }
        else if (dataset === 'comment') {
            inp.value = oldData.comment;
        };
    });
    renderTagsList('selected-tags');
    renderTagsPane(expenseTags, 'tags-list');
}
function getValuesFromEditPane() {
    const updatedValue = {};
    const inputs = document.querySelectorAll('.inputs');
    inputs.forEach(inp => {
        let dataset = inp.dataset.inputType;
        if (dataset === 'amount') {
            updatedValue.amount = inp.value;
        }
        else if (dataset === 'category') {
            updatedValue.category = inp.value;
        }
        else if (dataset === 'datetime') {
            updatedValue.datetime = inp.value;
        }
        else if (dataset === 'payment-mode') {
            updatedValue.paymentMode = inp.value;
        }
        else if (dataset === 'comment') {
            updatedValue.comment = inp.value;
        };
    });
    updatedValue.tags = tagsList;
    return updatedValue;
};
function getEditingExpense(id) {
    let selectedExpense;
    for (let i = 0; i < collectiveExpenses.length; i++) {
        if (collectiveExpenses[i].id === id) {
            selectedExpense = collectiveExpenses[i];
            break;
        };
    };
    return selectedExpense;
};

function deleteBtn() {
    const deleteButton = document.querySelectorAll('.delete-button');
    deleteButton.forEach(btn => {
        btn.addEventListener('click', () => {
            deleteExpense(btn.dataset.expenseId);
        });
    });
};
function deleteExpense(id) {
    collectiveExpenses.forEach((exp, ind) => {
        if (exp.id === id) {
            collectiveExpenses.splice(ind, 1);
            saveToStorage(collectiveExpenses, 'expenses')
            reRender();
        }
    })
};
