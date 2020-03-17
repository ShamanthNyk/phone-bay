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

function render(hashKey) {
    let pages = document.querySelectorAll(".page");
    for(let i=0;i<pages.length;i++) {
        pages[i].style.display = 'none';
    }

    switch(hashKey) {
        case "#home": document.getElementById("home-page").style.display = 'block'; break;
        case "#add": document.getElementById("add-page").style.display = 'block'; break;
        case "#orders": document.getElementById("orders-page").style.display = 'block'; break;
        case "#logs": document.getElementById("logs-page").style.display = 'block'; break;
    }
}

window.onhashchange = function() {
    render(window.location.hash);
};

document.getElementById('add').onclick = function() {
        
};