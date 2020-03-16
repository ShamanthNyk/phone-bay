"use strict";

document.getElementById("back-btn").style.display = "none";

document.getElementById("sign-in-btn").onclick = function() {
    this.style.display = "none";
    document.getElementById("sign-up-btn").style.display = "none";
    document.getElementById("back-btn").style.display = "block";
    document.getElementById("sign-in-form").style.display = "block";
};

document.getElementById("sign-up-btn").onclick = function() {
    this.style.display = "none";
    document.getElementById("sign-in-btn").style.display = "none";
    document.getElementById("back-btn").style.display = "block";
    document.getElementById("sign-up-form").style.display = "block";        
};

document.getElementById("back-btn").onclick = function() {
    this.style.display = "none";
    document.getElementById("sign-in-btn").style.display = "inline-block";
    document.getElementById("sign-up-btn").style.display = "inline-block";
    document.getElementById("sign-in-form").style.display = "none";
    document.getElementById("sign-up-form").style.display = "none"; 
};



