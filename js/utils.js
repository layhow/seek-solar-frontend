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

//____________ Day of the Year ___________
function getDOTY() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    console.log('Day of year: ' + day);
    return day;
}
