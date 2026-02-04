export function saveToStorage(data,key){
if(key){
    localStorage.setItem(key,JSON.stringify(data));
}
else{
    localStorage.setItem('expenses',JSON.stringify(data))
}
}