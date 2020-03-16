import { render } from "pug";

document.getElementById("home-btn").onclick = function() {
    this.className = "active";
    document.getElementById("logs-btn").className = "none";
    document.getElementById("orders-btn").className = "none";
    document.getElementById("add-btn").className = "none";
};

document.getElementById("add-btn").onclick = function() {
    this.className = "active";
    document.getElementById("home-btn").className = "none";
    document.getElementById("orders-btn").className = "none";
    document.getElementById("logs-btn").className = "none"; 
};

document.getElementById("orders-btn").onclick = function() {
    this.className = "active";
    document.getElementById("logs-btn").className = "none";
    document.getElementById("home-btn").className = "none";
    document.getElementById("add-btn").className = "none";
};

document.getElementById("logs-btn").onclick = function() {
    this.className = "active";
    document.getElementById("home-btn").className = "none";
    document.getElementById("orders-btn").className = "none";
    document.getElementById("add-btn").className = "none";
     
};

// window.onhashchange = function() {
//     render(window.location.hash);
// };

// function render(hashKey) {
//     let pages = ""
// }