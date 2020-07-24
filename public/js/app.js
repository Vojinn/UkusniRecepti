if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('service worker registered', reg))
    .catch((err) => console.log('service worker not registered', err));
}
window.addEventListener("load", () => {
    hasNetwork(navigator.onLine);
    window.addEventListener("online", () => {
        hasNetwork(true);
    });

    window.addEventListener("offline", () => {
        hasNetwork(false);
    });
});

function hasNetwork(online){
    const element = document.querySelector(".status");
    if(online){
        element.classList.remove("offline");
        element.classList.add("online");
        element.innerText = "Online";
    } else {
        element.classList.remove("online");
        element.classList.add("offline");
        element.innerText = "Offline";
    }
}