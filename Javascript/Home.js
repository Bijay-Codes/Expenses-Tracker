import { saveToStorage } from "./utility.js"
import { collectiveExpenses } from "./Data/expenses.js"
const form = document.getElementById('edit-pane');
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
                <span class="expense-date-time">${elem.dateTime}</span>
                <span class="expense-mode online">${elem.paymentMode} Payment</span>
            </div>
            <p class="expense-comment">
                ${elem.comment}
            </p>
            <div class="expense-tags">${elem.tags}</div>
            <div class="card-buttons">
            <button type="submit"class="save-button">Save Changes</button>
            <button type="reset"class="cancel-button">Cancel</button>
            </div>
        </div>`
    });
    tagsPane.innerHTML = html;
}
renderExpenses();