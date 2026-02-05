import { saveToStorage, formatDate } from "./utility.js"
import { collectiveExpenses } from "./Data/expenses.js"
const form = document.getElementById('edit-pane');
console.log(collectiveExpenses);;

function renderExpenses() {
    const tagsPane = document.querySelector('.expenses-pane');
    let html = '';
    collectiveExpenses.forEach(elem => {
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
            <div class="expense-tags">${elem.tags}</div>
            <div class="card-buttons">${renderButtons(elem.createdAt)}</div>
        </div>`
    });
    tagsPane.innerHTML = html;
}
renderExpenses();
renderEditPane();
addClassToForm();
function isLocked(timeCreated) {
    const lockTime = 24 * 60 * 60 * 1000
    return Date.now() - timeCreated > lockTime;
}
function renderButtons(timeCreated) {
    if (isLocked(timeCreated)) {
        return `<button type="button" class="locked">Edit 🔒</button>
            <button type="button" class="locked">Delete 🔒</button>`
    }
    else {
        return `<button type="submit"class="edit-button">Edit</button>
            <button type="reset"class="Delete-button">Delete</button>`
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
            editPane.classList.remove('hidden');
            editPane.classList.add('editing');
        });
    })
};
