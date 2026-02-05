export function saveToStorage(data,key){
    localStorage.setItem(key,JSON.stringify(data));
};