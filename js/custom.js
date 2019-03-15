//Background Youtube video function
(function ($) {
    $(document).ready(function () {
        //Device.js will check if it is Tablet or Mobile - http://matthewhudson.me/projects/device.js/
        if (!device.tablet() && !device.mobile()) {
            $(".player").mb_YTPlayer();
        } else {
            //jQuery will add the default background to the preferred class 
            $('.big-background, .small-background-section').addClass(
                'big-background-default-image');
        }
        getCost(billTokWh(330, 0, "day"), 100);
    });
})(jQuery);
var monthy_bill = 330;
//_________ Constant _____________
var SOLAR_PANEL_EFFICIENCY = 0.187;                 //PV solar panel efficiency from https://www.solarpowerrocks.com/solar-basics/how-much-electricity-does-a-solar-panel-produce/
var USABLE_ROOF_AREA = 0.75;                        //Setback for unusable roof area
var AVERAGE_SOLAR_PANEL_LIFETIME = 50;              //Lifespan for PV solar panel in years
var TARIFF_DOMESTIC = 0;
var ICPT = -0.0225;                                  //Imbalance Cost Pass-Through (ICPT) RM/kWh  **For Future Use
var SERVICE_CHARGE = 0.06;                          //Electric bill service charge
var DEMO_SOLAR_RADIATION = 18.54;                   //Amount of solar radiation megajoules per day
var SOLAR_PANEL_DEGRADATION = 1 / 1.01              //Solar Panel degradation per year
var COST_PER_KWH = 5000;                            //Verified with +Solar high average is RM9k/kwh, max RM10k/kwh. Solar Bee charged RM7.3K to RM7.75K. Path Green charged RM5K to RM7K.<2015> Solarvest Energy Sdn Bhd charge RM5k to RM6.5k<2018>
var LOSSES = 1.25;                                  //How much more needed to be generated due to losses *Verified with +Solar it should be 25% losses
var ANNUAL_INCREASE_IN_POWER_CONSUMPTION = 1.03;    //Rate of power increase per year
var USABLE_SUNLIGHT = 4;                            //Take 4 hours of usable sunlight per day on average

//______________ Map _____________
function demoPolygonCoord() {
    // Define the LatLng coordinates for the polygon.
    var demoHousePolyCoords = [
        { lat: 2.992307, lng: 101.525286 },
        { lat: 2.992335, lng: 101.525381 },
        { lat: 2.992147, lng: 101.525442 },
        { lat: 2.992122, lng: 101.525347 }
    ];

    return demoHousePolyCoords;
}

function getPolygonArea(input) {
    var area = Math.round(google.maps.geometry.spherical.computeArea(input) * USABLE_ROOF_AREA);
    return area;    //in m2   
}

function drawPolygon(polyCoords) {
    // Construct the polygon.
    var drawnPoly = new google.maps.Polygon({
        paths: polyCoords,
        strokeColor: '#FFFF00',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillColor: '#FFFF00',
        fillOpacity: 0.35
    });

    return drawnPoly;
}

//_________ Calculation _____________
function billTokWh(monthy_bill, tariff, return_type) {
    var kWh_per_month = 0;
    if (tariff == 0) {
        //Tariffs in RM
        var tariffA1 = 0.218 + ICPT; var bandA1 = 200; var cumbandA1 = tariffA1 * bandA1;
        var tariffA2 = 0.334 + ICPT; var bandA2 = 100; var cumbandA2 = tariffA2 * bandA2 + cumbandA1;
        var tariffA3 = 0.516 + ICPT; var bandA3 = 300; var cumbandA3 = (tariffA3 * bandA3) * (1 + SERVICE_CHARGE) + cumbandA2;
        var tariffA4 = 0.546 + ICPT; var bandA4 = 300; var cumbandA4 = (tariffA4 * bandA4) * (1 + SERVICE_CHARGE) + cumbandA3;
        var tariffA5 = 0.571 + ICPT;   //>900
        if (monthy_bill <= cumbandA1) {
            kWh_per_month = Math.round(monthy_bill / tariffA1);
        }
        else if (monthy_bill > cumbandA1 && monthy_bill <= cumbandA2) {
            monthy_bill = monthy_bill - cumbandA1;
            kWh_per_month = Math.round(monthy_bill / tariffA2) + bandA1;
        }
        else if (monthy_bill > cumbandA2 && monthy_bill <= cumbandA3) {
            monthy_bill = (monthy_bill - cumbandA2) / (1 + SERVICE_CHARGE);
            kWh_per_month = Math.round(monthy_bill / tariffA3) + bandA1 + bandA2;
        }
        else if (monthy_bill > cumbandA3 && monthy_bill <= cumbandA4) {
            monthy_bill = (monthy_bill - cumbandA3) / (1 + SERVICE_CHARGE);
            kWh_per_month = Math.round(monthy_bill / tariffA4) + bandA1 + bandA2 + bandA3;
        }
        else if (monthy_bill > cumbandA4) {
            monthy_bill = (monthy_bill - cumbandA4) / (1 + SERVICE_CHARGE);
            kWh_per_month = Math.round(monthy_bill / tariffA5) + bandA1 + bandA2 + bandA3 + bandA4;
        }
    }
    console.log("kwh per month:" + kWh_per_month);
    if (return_type == "day") {
        return Math.round(10 * kWh_per_month * 12 / 365) / 10;
    } else if (return_type == "month") {
        return kWh_per_month
    }
}

function demoTotalEnergy() {
    //Annual Energy = Solar Radiation(MJ/m2/day) * Area(m2) * days
    return Math.round(DEMO_SOLAR_RADIATION * getPolygonArea(drawPolygon(demoPolygonCoord()).getPath()) * 365);
}

function kWhToRM(tariff, kWh) {
    var total_RM = 0;
    if (tariff == 0) {
        if (kWh < 201) {
            total_RM = Math.round(kWh * 0.218);
        }
        else if (kWh > 200 && kWh < 301) {
            total_RM = Math.round((200 * 0.218) + ((kWh - 200) * 0.334));
        }
        else if (kWh > 300 && kWh < 601) {
            total_RM = Math.round((200 * 0.218) + (100 * 0.334) + ((kWh - 300) * 0.516));
        }
        else if (kWh > 600 && kWh < 901) {
            total_RM = Math.round((200 * 0.218) + (100 * 0.334) + (300 * 0.516) + ((kWh - 600) * 0.546));
            total_RM = total_RM + (total_RM * SERVICE_CHARGE);
        }
        else {
            total_RM = Math.round((200 * 0.218) + (100 * 0.334) + (300 * 0.516) + (300 * 0.546) + ((kWh - 900) * 0.571));
            total_RM = total_RM + (total_RM * SERVICE_CHARGE);
        }
        console.log("kWh: " + kWh)
        console.log("RM " + total_RM);
        return total_RM;
    }
}

function getMaxEarning() {
    var total_energy_on_roof_per_day = (DEMO_SOLAR_RADIATION * 0.277777778) * getPolygonArea(drawPolygon(demoPolygonCoord()).getPath())     //kWH/day
    var total_energy_per_month = total_energy_on_roof_per_day * 30;
    var total_energy_generated_by_panel_per_month = total_energy_per_month * SOLAR_PANEL_EFFICIENCY;
    var total_earning_based_on_tnb_per_month = kWhToRM(TARIFF_DOMESTIC, total_energy_generated_by_panel_per_month);
    var maxEarning = 0;
    for (i = 0; i < AVERAGE_SOLAR_PANEL_LIFETIME; i++) {
        maxEarning = maxEarning + (total_earning_based_on_tnb_per_month * 12 * SOLAR_PANEL_DEGRADATION);
    }
    return Math.round(maxEarning);
}

function getCost(kWh_per_day, area) {
    var demand_per_hour = kWh_per_day / USABLE_SUNLIGHT;
    var system_size = Math.round(demand_per_hour * LOSSES);
    panel_size = Math.ceil(system_size * 5);                                //1kW panel = 5m2
    system_cost = 1000 * Math.round((system_size * COST_PER_KWH) / 1000);   //round to nearest 1000s
    getPayback(monthy_bill, system_cost)
    var generation = Math.ceil(100 * panel_size / area);                    //Percentage of used roof for solar panel
    console.log("Panel size: " + panel_size);                               
    console.log("System size: " + system_size);
    console.log("System cost: " + system_cost);
    return system_cost;
}

function getPayback(monthy_bill, system_cost) {
    var payback = Math.round(Math.log(1 - system_cost *                         //Payback period in years
        (1 - ANNUAL_INCREASE_IN_POWER_CONSUMPTION * SOLAR_PANEL_DEGRADATION) / (monthy_bill * 12)) /
        Math.log(ANNUAL_INCREASE_IN_POWER_CONSUMPTION * SOLAR_PANEL_DEGRADATION));
    console.log("payback: " + payback);
    return payback;
}

//___________ Util _____________
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



//Reference: https://www.theedgemarkets.com/article/going-green-better-returns-solar-investments-expected