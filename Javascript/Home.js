import * as utility from "./utility.js";
import { collectiveExpenses } from "./Data/expenses.js";
import { category } from "./Data/category.js";
import { expenseTags } from "./Data/tags.js";
import { scores } from "./Data/RoastData.js";
let editId = '';
let filteredData = [];
let statusbox = document.querySelector('.statusbox');

renderListeners();
// renderss the expenses pane and all cards.
function renderExpenses() {
    const tagsPane = document.querySelector('.expenses-pane');
    filteredData = utility.filterByMonth();
    let html = '';
    if (filteredData.length === 0) {
        statusbox.innerText = 'No Expenses Yet For This Selected Month ^_^ .';
    }
    filteredData.forEach(elem => {
        html += `<div class="expense-card">
            <div class="expense-header">
                <span class="expense-category main">${elem.category}⇒</span>
                <span class="expense-amount main">₹${elem.amount}</span>
                </div>
                <div class="expense-body">
                <span class="expense-tags main">${elem.tags.join(' — ')}</span>
                <p class="expense-comment main">Comment •${elem.comment}</p>
                <span class="expense-date-time secondary">${utility.formatDate(elem.datetime)}</span>
                <span class="expense-mode online secondary">${elem.paymentMode === '0' ? 'Online' : 'Offline'} Payment</span>
            </div>
            <div class="card-buttons">${renderButtons(elem.createdAt, elem.id)}</div>
        </div>`;
    });
    tagsPane.innerHTML = html;
    utility.roastUser(filteredData, statusbox);
    editButtons();
    deleteBtn();
};

//renders everything...
renderPage();
function renderPage() {
    renderExpenses();
    editButtons();
    addClassToForm();
    utility.renderCategory(category, 'category-list');
    utility.renderTagsPane(expenseTags, 'tags-list')
    submitButtonClick();
    deleteBtn();
};
// renders persistent eventListeners and functions that should only be run once.
function renderListeners() {
    // renders both year and month dropdowns
    utility.renderMonths('filter-selector');
    utility.renderYearFilter('filter-selector-year');

    // renders expenses when the filter is active.
    const month = document.querySelector('.filter-selector');
    const year = document.querySelector('.filter-selector-year');
    month.addEventListener('change', () => {
        renderExpenses();
    });
    year.addEventListener('change', () => {
        renderExpenses();
    });
};
// determines if the expense will be locked or not.
function isLocked(timeCreated) {
    const lockTime = 24 * 60 * 60 * 1000
    return Date.now() - timeCreated > lockTime;
};
// generating 2 variants of buttons based on the isLocked result.
function renderButtons(timeCreated, id) {
    if (isLocked(timeCreated)) {
        return `<button type="button" class="locked edit-delete-buttons">Edit 🔒</button>
            <button type="button" class="locked edit-delete-buttons">Delete 🔒</button>`
    }
    else {
        return `<button class="edit-button edit-delete-buttons"data-expense-id="${id}">Edit ✏️ </button>
            <button class="delete-button edit-delete-buttons"data-expense-id="${id}">Delete 🗑️</button>`
    };
};
// collapses the edit pane when the edit button or cancel button is clicked by adding the class hidden.
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
// makes the edit pane visible by adding the class editing.
function renderEditPane() {
    const editPane = document.getElementById('edit-pane');
    addOldData();
    editPane.classList.remove('hidden');
    editPane.classList.add('editing');
};
// adds event listener to the edit buttons.
function editButtons() {
    const editButton = document.querySelectorAll('.edit-button');
    editButton.forEach(btn => {
        btn.addEventListener('click', () => {
            editId = btn.dataset.expenseId;
            renderEditPane();
        });
    });
};
// adds the event listeners to the delete buttons.
function deleteBtn() {
    const deleteButton = document.querySelectorAll('.delete-button');
    deleteButton.forEach(btn => {
        btn.addEventListener('click', () => {
            deleteExpense(btn.dataset.expenseId);
        });
    });
};
// actually  deletes the expenses.
function deleteExpense(id) {
    collectiveExpenses.forEach((exp, ind) => {
        if (exp.id === id) {
            collectiveExpenses.splice(ind, 1);
            utility.saveToStorage(collectiveExpenses, 'expenses');
            scores.deleteCount++;
            utility.saveToStorage(scores, 'scores');
            renderExpenses();
        };
    });
};
// adds event listener to the submit button.
function submitButtonClick() {
    const btn = document.querySelector('.submit-button');
    btn.addEventListener('click', () => {
        submitButton();
    });
};
// submits the form and closes the edit pane.
function submitButton() {
    const editData = getValuesFromEditPane();
    collectiveExpenses.forEach(exp => {
        if (exp.id === editId) {
            if (isEdited(exp, editData)) {
                scores.editCount++;
                utility.saveToStorage(scores, 'scores');
            }
            Object.assign(exp, editData);
            utility.saveToStorage(collectiveExpenses, 'expenses');
        };
    });
    utility.tagsList.length = 0;
    renderExpenses();
    editButtons();
    deleteBtn();
    document.getElementById('edit-pane').classList.add('hidden');
    document.getElementById('edit-pane').classList.remove('editing');
};
// checkes wether the expenses amount or category or tags or payment mode was edited or not.
function isEdited(realData, editedData) {
    if (realData.amount !== editedData.amount ||
        realData.category !== editedData.category ||
        realData.paymentMode !== editedData.paymentMode ||
        JSON.stringify(realData.tags) !== JSON.stringify(editedData.tags)) {
        return true;
    }
    else {
        return false;
    }
};
/* notice i could have rendered the category and tags using just 1 for loop  or just 
have copy pasted it but well it will just be a pain to write the code again and its not a good
practice to write the same code 2 times manually... 
Also i want to categorize what each function does rather than doing 2 tasks i prefer that the
function does just 1 task that its given correctly and also in my opinion it will help me in
debugging in some way or if i want to change something i wont break multiple stuff.
*/
// adds the data of the expense editing to the edit pane.
function addOldData() {
    const oldData = getEditingExpense(editId);
    const inputs = document.querySelectorAll('.inputs');
    utility.tagsList.length = 0;
    oldData.tags.forEach(tag => {
        utility.tagsList.push(tag);
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
    utility.renderTagsList('selected-tags');
    utility.renderTagsPane(expenseTags, 'tags-list');
}
// gets the values of the editpane outside of the feilds
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
    updatedValue.tags = [...utility.tagsList]
    return updatedValue;
};
// gets us the exense we are editing currently.
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
