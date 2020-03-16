document.getElementById("pimg").onchange = function() {
    document.getElementById("display-img").src = this.value;
    document.getElementById("display-img").style.display = "block";
};