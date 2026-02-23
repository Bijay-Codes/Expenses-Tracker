import "https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js";
import { expenseTags } from "./Data/tags.js";
import { collectiveExpenses } from "./Data/expenses.js";
import { loadRoastsTier1, stopRoasts } from "./Data/RoastData.js";

export let tagsList = [];
export const months = {
    'All': 'all', 'January': '01', 'February': '02', 'March': '03',
    'April': '04', 'May': '05', 'June': '06', 'July': '07',
    'August': '08', 'September': '09', 'October': '10', 'November': '11',
    'December': '12'
};
export function saveToStorage(data, key) {
    localStorage.setItem(key, JSON.stringify(data));
};
export function formatDate(dateTime) {
    return dayjs(dateTime).format("MMM D, YYYY • h:mm A");
};
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
// shows and renders on the ui what tags are selected by user.
export function renderTagsList(classSelector) {
    const tagsHtml = document.querySelector(`.${classSelector}`);
    let html = 'Selected Tags (Max 4) ✏️';
    tagsList.forEach(tag => {
        html += `<span class="tags">${tag}</span>`;
    });
    tagsHtml.innerHTML = html;
};
let tier1RoastId;
let tier2RoastId;
// deletes the tag from tagslist if its already in the tagslist.
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
        return filterData = collectiveExpenses.filter(data => {
            let month = dayjs(data.datetime).format('MM');
            let year = dayjs(data.datetime).format('YYYY');
            return month === monthInp.value && year === yearInp.value;
        });
    };
};

export function oldestAndLatestExpense() {
    if (collectiveExpenses.length !== 0) {
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
        return date;
    }
};
export function renderMonths(classSelector) {
    let selector = document.querySelector(`.${classSelector}`);
    let html = '';
    for (const [key, val] of Object.entries(months)) {
        html += `<option value="${val}"${dayjs().format('MMMM') === key ? 'selected' : ''}>${key}</option>`;
    }
    selector.innerHTML = html;
};
export function renderYearFilter(classSelector) {
    const selectedDom = document.querySelector(`.${classSelector}`);
    let html = '';
    if (collectiveExpenses.length !== 0) {
        const format = oldestAndLatestExpense();
        html = '';
        for (let i = format.oldest; i < format.latest + 1; i++) {
            html += `<option value="${i}"${i === Number(dayjs().format('YYYY')) ? 'selected' : ''}>${i}</option>`
        };
    } else {
        html = dayjs().format('YYYY');
    }
    selectedDom.innerHTML = html;
};

export function roastUser(filteredData, statusbox) {
    if (filteredData.length !== 0) {
        loadRoastsTier1('statusbox');
    } else {
        stopRoasts();
    };
};

