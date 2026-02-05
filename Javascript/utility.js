import "https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js";
export function saveToStorage(data,key){
    localStorage.setItem(key,JSON.stringify(data));
};
export function formatDate(dateTime){
    return dayjs(dateTime).format("MMM D, YYYY • h:mm A");
}