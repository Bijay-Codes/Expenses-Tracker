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

// export function renderTagsPane(list, classSelector) {
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
    const input = document.querySelector('.filter-selector');
    let filterData = [];
    if(input.value==='all'){
        filterData = collectiveExpenses;
        return filterData;
    }else{
        return collectiveExpenses.filter(data=>{
            let date = data.datetime.slice(5,7);
            return date===input.value;
        })
    }
    
}
