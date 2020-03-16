document.getElementById("home-btn").onclick = function() {
    this.className = "active";
    document.getElementById("logs-btn").className = "none";
    document.getElementById("cart-btn").className = "none";
    document.getElementById("track-btn").className = "none";
};

document.getElementById("cart-btn").onclick = function() {
    this.className = "active";
    document.getElementById("logs-btn").className = "none";
    document.getElementById("home-btn").className = "none";
    document.getElementById("track-btn").className = "none";
};

document.getElementById("logs-btn").onclick = function() {
    this.className = "active";
    document.getElementById("home-btn").className = "none";
    document.getElementById("cart-btn").className = "none"; 
    document.getElementById("track-btn").className = "none";
};

document.getElementById("track-btn").onclick = function() {
    this.className = "active";
    document.getElementById("logs-btn").className = "none";
    document.getElementById("cart-btn").className = "none"; 
    document.getElementById("home-btn").className = "none";
};
