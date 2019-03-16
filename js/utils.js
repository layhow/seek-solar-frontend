//___________ Thousand Formatting _____________
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//___________ Slider _____________
var slider = document.getElementById("myRange");
var output = document.getElementById("monthly_bill");
output.innerHTML = slider.value;

slider.oninput = function () {
    monthy_bill = this.value;
    output.innerHTML = this.value;
    var roof_size = roof_area;
    getCost(billTokWh(this.value, 0, "day"), roof_size);
}