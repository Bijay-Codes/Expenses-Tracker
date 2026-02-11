import "https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js";
import { expenseTags } from "./Data/tags.js";
import { collectiveExpenses } from "./Data/expenses.js";
export let tagsList = [];
export function saveToStorage(data, key) {
    localStorage.setItem(key, JSON.stringify(data));
};
export function formatDate(dateTime) {
    return dayjs(dateTime).format("MMM D, YYYY • h:mm A");
}
export function renderCategory(list, classSelector) {
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
    categoryTag.innerHTML = html;
};

export function renderTagsPane(list, classSelector) {
    const tagsPane = document.querySelector(`.${classSelector}`);
    let html = '';
    list.forEach(tag => {
        const isSelected = tagsList.includes(tag);
        const selectedClass = isSelected ? ' selected' : '';
        html += `<button type="button" class="tags-button${selectedClass}">${tag}</button>`;
    })
    tagsPane.innerHTML = html;
    const tagsButtons = document.querySelectorAll('.tags-button');
    tagsButtons.forEach(button => {
        button.addEventListener('click', () => {
            addToList(button.innerText);
        });
    });
};
export function addToList(tag) {
    if (tagsList.includes(tag)) {
        deleteFromList(tag);
        renderTagsList('selected-tags');
    } else if (tagsList.length < 4) {
        tagsList.push(tag);
        renderTagsList('selected-tags');
    };
    renderTagsPane(expenseTags, 'tags-list');
};

export function renderTagsList(classSelector) {
    const tagsHtml = document.querySelector(`.${classSelector}`);
    let html = 'Selected Tags (Max 4):';
    tagsList.forEach(tag => {
        html += `<span class="tags">${tag}</span>`;
    });
    tagsHtml.innerHTML = html;
};

export function deleteFromList(tag) {
    tagsList.splice(tagsList.indexOf(tag), 1);
};
export function filterByMonth() {
    const monthInp = document.querySelector('.filter-selector');
    const yearInp = document.querySelector('.filter-selector-year');
    let filterData = [];
    if (monthInp.value === 'all') {
        return filterData = collectiveExpenses.filter(data => {
            let year = dayjs(data.datetime).format('YYYY');
            return year === yearInp.value;
        });
    } else {
        return collectiveExpenses.filter(data => {
            let month = dayjs(data.datetime).format('MM');
            let year = dayjs(data.datetime).format('YYYY');
            return month === monthInp.value && year === yearInp.value;
        })
    }

};

export function oldestAndLatestExpense() {
    const date = {
        oldest: Number(dayjs(collectiveExpenses[0].datetime).format('YYYY')),
        latest: Number(dayjs().format('YYYY'))
    }
    collectiveExpenses.forEach(data => {
        let year = Number(dayjs(data.datetime).format('YYYY'));
        if (year < date.oldest) {
            date.oldest = year;
        }
        else if (date.latest < year) {
            date.latest = year;
        }
    });
    return date
};
