import "https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js";
export const tagsList = []
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
    categoryTag.innerHTML = `<label for="category">Category: </label>
                <select name="category">${html}</select>`;
};

export function renderTagsPane(list, classSelector) {
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
};

export function addToList(tag) {
    if (tagsList.includes(tag)) {
        deleteFromList(tag);
        renderTagsList('selected-tags');
    } else if (tagsList.length < 4) {
        tagsList.push(tag);
        renderTagsList('selected-tags');
    };
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



