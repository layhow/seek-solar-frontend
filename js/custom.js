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
var COST_PER_KWH_LOW = 4500;                        //Verified with +Solar high average is RM9k/kwh, max RM10k/kwh. Solar Bee charged RM7.3K to RM7.75K. Path Green charged RM5K to RM7K.<2015> Solarvest Energy Sdn Bhd charge RM5k to RM6.5k<2018>
var COST_PER_KWH_HIGH = 6500;
var LOSSES = 1.25;                                  //How much more needed to be generated due to losses *Verified with +Solar it should be 25% losses
var ANNUAL_INCREASE_IN_POWER_CONSUMPTION = 1.03;    //Rate of power increase per year
var USABLE_SUNLIGHT = 6;                            //Take 4 hours of usable sunlight per day on average
var INCREASE_BILL_FACTOR = 0.01 / 5                 //Assumption electricity bill increase 1% every 5 years.

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

function demoHouseCoordinates() {
    var listOfDemoHouseCoords = [[{ "lat": 2.992611, "lng": 101.524243 }, { "lat": 2.992651, "lng": 101.524335 }, { "lat": 2.992463, "lng": 101.524399 }, { "lat": 2.992437, "lng": 101.5243 }], [{ "lat": 2.992656, "lng": 101.524343 }, { "lat": 2.992675, "lng": 101.524407 }, { "lat": 2.992485, "lng": 101.524488 }, { "lat": 2.992466, "lng": 101.524402 }], [{ "lat": 2.992678, "lng": 101.524437 }, { "lat": 2.992696, "lng": 101.524506 }, { "lat": 2.99252, "lng": 101.524565 }, { "lat": 2.992496, "lng": 101.524501 }], [{ "lat": 2.992715, "lng": 101.52452 }, { "lat": 2.992737, "lng": 101.524587 }, { "lat": 2.992546, "lng": 101.524654 }, { "lat": 2.992522, "lng": 101.524581 }], [{ "lat": 2.992739, "lng": 101.524614 }, { "lat": 2.992758, "lng": 101.524686 }, { "lat": 2.992573, "lng": 101.524745 }, { "lat": 2.992549, "lng": 101.524678 }], [{ "lat": 2.992766, "lng": 101.524699 }, { "lat": 2.992801, "lng": 101.524793 }, { "lat": 2.992737, "lng": 101.524823 }, { "lat": 2.992731, "lng": 101.524791 }, { "lat": 2.992616, "lng": 101.524844 }, { "lat": 2.992589, "lng": 101.524758 }], [{ "lat": 2.992806, "lng": 101.524812 }, { "lat": 2.992838, "lng": 101.524917 }, { "lat": 2.992651, "lng": 101.524954 }, { "lat": 2.992624, "lng": 101.524885 }], [{ "lat": 2.992833, "lng": 101.524938 }, { "lat": 2.992863, "lng": 101.524997 }, { "lat": 2.992686, "lng": 101.525062 }, { "lat": 2.992659, "lng": 101.524989 }], [{ "lat": 2.992876, "lng": 101.525013 }, { "lat": 2.992892, "lng": 101.52508 }, { "lat": 2.992713, "lng": 101.525153 }, { "lat": 2.992683, "lng": 101.52508 }], [{ "lat": 2.992905, "lng": 101.525107 }, { "lat": 2.99293, "lng": 101.525177 }, { "lat": 2.992753, "lng": 101.525239 }, { "lat": 2.992715, "lng": 101.525166 }], [{ "lat": 2.992935, "lng": 101.525196 }, { "lat": 2.992959, "lng": 101.525265 }, { "lat": 2.992774, "lng": 101.525324 }, { "lat": 2.992747, "lng": 101.525252 }], [{ "lat": 2.992967, "lng": 101.525281 }, { "lat": 2.993002, "lng": 101.525394 }, { "lat": 2.992881, "lng": 101.525445 }, { "lat": 2.992871, "lng": 101.525413 }, { "lat": 2.992825, "lng": 101.525424 }, { "lat": 2.992782, "lng": 101.525343 }], [{ "lat": 2.992771, "lng": 101.52413 }, { "lat": 2.992797, "lng": 101.524186 }, { "lat": 2.99269, "lng": 101.524228 }, { "lat": 2.992667, "lng": 101.524165 }], [{ "lat": 2.992805, "lng": 101.524237 }, { "lat": 2.992821, "lng": 101.524275 }, { "lat": 2.992717, "lng": 101.524314 }, { "lat": 2.992705, "lng": 101.524267 }], [{ "lat": 2.992822, "lng": 101.524279 }, { "lat": 2.992837, "lng": 101.524319 }, { "lat": 2.992733, "lng": 101.524355 }, { "lat": 2.992718, "lng": 101.524315 }], [{ "lat": 2.992859, "lng": 101.524397 }, { "lat": 2.992845, "lng": 101.524354 }, { "lat": 2.992747, "lng": 101.524397 }, { "lat": 2.992761, "lng": 101.524439 }], [{ "lat": 2.992864, "lng": 101.524397 }, { "lat": 2.992875, "lng": 101.524439 }, { "lat": 2.992778, "lng": 101.52448 }, { "lat": 2.992763, "lng": 101.524441 }], [{ "lat": 2.992901, "lng": 101.524523 }, { "lat": 2.992888, "lng": 101.524482 }, { "lat": 2.99279, "lng": 101.524518 }, { "lat": 2.992809, "lng": 101.524562 }], [{ "lat": 2.992904, "lng": 101.52452 }, { "lat": 2.992919, "lng": 101.524563 }, { "lat": 2.992821, "lng": 101.5246 }, { "lat": 2.992806, "lng": 101.524561 }], [{ "lat": 2.992948, "lng": 101.52465 }, { "lat": 2.992934, "lng": 101.524604 }, { "lat": 2.992832, "lng": 101.524644 }, { "lat": 2.992853, "lng": 101.524693 }], [{ "lat": 2.992992, "lng": 101.524814 }, { "lat": 2.992971, "lng": 101.52475 }, { "lat": 2.992873, "lng": 101.524779 }, { "lat": 2.992901, "lng": 101.524849 }], [{ "lat": 2.992994, "lng": 101.524821 }, { "lat": 2.993015, "lng": 101.524874 }, { "lat": 2.99292, "lng": 101.524907 }, { "lat": 2.992901, "lng": 101.524858 }], [{ "lat": 2.993033, "lng": 101.524933 }, { "lat": 2.993011, "lng": 101.524882 }, { "lat": 2.992924, "lng": 101.524913 }, { "lat": 2.992946, "lng": 101.52497 }], [{ "lat": 2.993033, "lng": 101.524946 }, { "lat": 2.99305, "lng": 101.525002 }, { "lat": 2.992972, "lng": 101.52503 }, { "lat": 2.992951, "lng": 101.524983 }], [{ "lat": 2.993069, "lng": 101.525064 }, { "lat": 2.993049, "lng": 101.525011 }, { "lat": 2.992974, "lng": 101.525039 }, { "lat": 2.99299, "lng": 101.525092 }], [{ "lat": 2.993074, "lng": 101.525073 }, { "lat": 2.993092, "lng": 101.525129 }, { "lat": 2.993011, "lng": 101.525156 }, { "lat": 2.992988, "lng": 101.525101 }], [{ "lat": 2.993112, "lng": 101.525188 }, { "lat": 2.993092, "lng": 101.525137 }, { "lat": 2.993013, "lng": 101.525164 }, { "lat": 2.993031, "lng": 101.52522 }], [{ "lat": 2.993128, "lng": 101.525195 }, { "lat": 2.993144, "lng": 101.525247 }, { "lat": 2.993051, "lng": 101.525279 }, { "lat": 2.993033, "lng": 101.525227 }], [{ "lat": 2.99316, "lng": 101.525317 }, { "lat": 2.993137, "lng": 101.525255 }, { "lat": 2.99305, "lng": 101.525289 }, { "lat": 2.99308, "lng": 101.525352 }], [{ "lat": 2.992348, "lng": 101.524797 }, { "lat": 2.992381, "lng": 101.52487 }, { "lat": 2.992207, "lng": 101.524924 }, { "lat": 2.992187, "lng": 101.524865 }], [{ "lat": 2.992382, "lng": 101.524876 }, { "lat": 2.9924, "lng": 101.524935 }, { "lat": 2.992231, "lng": 101.524995 }, { "lat": 2.992206, "lng": 101.524931 }], [{ "lat": 2.992412, "lng": 101.524956 }, { "lat": 2.992432, "lng": 101.525022 }, { "lat": 2.99226, "lng": 101.525084 }, { "lat": 2.992242, "lng": 101.525015 }], [{ "lat": 2.992435, "lng": 101.525053 }, { "lat": 2.992459, "lng": 101.525116 }, { "lat": 2.992289, "lng": 101.525175 }, { "lat": 2.992266, "lng": 101.525102 }], [{ "lat": 2.992461, "lng": 101.52514 }, { "lat": 2.992485, "lng": 101.525207 }, { "lat": 2.992318, "lng": 101.525259 }, { "lat": 2.992294, "lng": 101.525191 }], [{ "lat": 2.992496, "lng": 101.525226 }, { "lat": 2.992515, "lng": 101.52532 }, { "lat": 2.992354, "lng": 101.525377 }, { "lat": 2.992328, "lng": 101.52528 }], [{ "lat": 2.992537, "lng": 101.525355 }, { "lat": 2.992569, "lng": 101.525444 }, { "lat": 2.9924, "lng": 101.525508 }, { "lat": 2.992371, "lng": 101.525414 }], [{ "lat": 2.992585, "lng": 101.525476 }, { "lat": 2.992609, "lng": 101.525551 }, { "lat": 2.992437, "lng": 101.525605 }, { "lat": 2.992413, "lng": 101.525538 }], [{ "lat": 2.992614, "lng": 101.525567 }, { "lat": 2.992636, "lng": 101.52564 }, { "lat": 2.992462, "lng": 101.525699 }, { "lat": 2.992437, "lng": 101.525618 }], [{ "lat": 2.992638, "lng": 101.525658 }, { "lat": 2.992668, "lng": 101.525728 }, { "lat": 2.992491, "lng": 101.525787 }, { "lat": 2.99247, "lng": 101.525715 }], [{ "lat": 2.992671, "lng": 101.525744 }, { "lat": 2.992697, "lng": 101.525819 }, { "lat": 2.992515, "lng": 101.525876 }, { "lat": 2.992494, "lng": 101.5258 }], [{ "lat": 2.992708, "lng": 101.525838 }, { "lat": 2.992727, "lng": 101.525908 }, { "lat": 2.992561, "lng": 101.525978 }, { "lat": 2.992531, "lng": 101.525886 }], [{ "lat": 2.992156, "lng": 101.524923 }, { "lat": 2.992218, "lng": 101.525092 }, { "lat": 2.992062, "lng": 101.525159 }, { "lat": 2.992033, "lng": 101.525095 }, { "lat": 2.992127, "lng": 101.52506 }, { "lat": 2.992079, "lng": 101.524934 }], [{ "lat": 2.992215, "lng": 101.525125 }, { "lat": 2.992068, "lng": 101.525178 }, { "lat": 2.992087, "lng": 101.525251 }, { "lat": 2.992258, "lng": 101.525186 }], [{ "lat": 2.992266, "lng": 101.525208 }, { "lat": 2.992285, "lng": 101.525283 }, { "lat": 2.992111, "lng": 101.525326 }, { "lat": 2.992087, "lng": 101.525259 }], [{ "lat": 2.992304, "lng": 101.525291 }, { "lat": 2.992336, "lng": 101.525387 }, { "lat": 2.992154, "lng": 101.525449 }, { "lat": 2.992121, "lng": 101.525342 }], [{ "lat": 2.992341, "lng": 101.525425 }, { "lat": 2.992365, "lng": 101.525522 }, { "lat": 2.992196, "lng": 101.525578 }, { "lat": 2.992156, "lng": 101.525481 }], [{ "lat": 2.992376, "lng": 101.525559 }, { "lat": 2.9924, "lng": 101.525621 }, { "lat": 2.992226, "lng": 101.52568 }, { "lat": 2.992196, "lng": 101.525605 }], [{ "lat": 2.992411, "lng": 101.525637 }, { "lat": 2.992437, "lng": 101.525707 }, { "lat": 2.992255, "lng": 101.525763 }, { "lat": 2.992229, "lng": 101.525696 }], [{ "lat": 2.99244, "lng": 101.525731 }, { "lat": 2.992459, "lng": 101.525795 }, { "lat": 2.992271, "lng": 101.525857 }, { "lat": 2.992242, "lng": 101.525784 }], [{ "lat": 2.992472, "lng": 101.525806 }, { "lat": 2.992499, "lng": 101.525881 }, { "lat": 2.992314, "lng": 101.525935 }, { "lat": 2.99229, "lng": 101.525873 }], [{ "lat": 2.992499, "lng": 101.525908 }, { "lat": 2.992526, "lng": 101.525997 }, { "lat": 2.99236, "lng": 101.526045 }, { "lat": 2.99233, "lng": 101.525954 }]];

    return listOfDemoHouseCoords;
}

function getPolygonArea(input) {
    var area = Math.round(google.maps.geometry.spherical.computeArea(input) * USABLE_ROOF_AREA);
    console.log("Roof size: " + area)
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
    var total_energy_on_roof_per_day = (DEMO_SOLAR_RADIATION * 0.277778) * getPolygonArea(drawPolygon(demoPolygonCoord()).getPath())     //kWH/day
    var total_energy_per_month = total_energy_on_roof_per_day * 30;
    var total_energy_generated_by_panel_per_month = total_energy_per_month * SOLAR_PANEL_EFFICIENCY;
    console.log("total energy gen/mth: " + total_energy_generated_by_panel_per_month)
    var total_earning_based_on_tnb_per_month = kWhToRM(TARIFF_DOMESTIC, total_energy_generated_by_panel_per_month);
    var maxEarning = 0;
    for (i = 0; i < AVERAGE_SOLAR_PANEL_LIFETIME; i++) {
        maxEarning = maxEarning + (total_earning_based_on_tnb_per_month * 12 * SOLAR_PANEL_DEGRADATION);
    }
    var test = 179*SOLAR_PANEL_EFFICIENCY*DEMO_SOLAR_RADIATION;
    return Math.round(maxEarning);
}

function getCost(kWh_per_day, area) {
    var demand_per_hour = kWh_per_day / USABLE_SUNLIGHT;
    var system_size = Math.round(demand_per_hour * LOSSES);
    panel_size = Math.ceil(system_size * 5);                                         //1kW panel = 5m2
    if (system_size < 8) {
        system_cost = 1000 * Math.round((system_size * COST_PER_KWH_HIGH) / 1000);   //round to nearest 1000s
    }
    else {
        system_cost = 1000 * Math.round((system_size * COST_PER_KWH_LOW) / 1000);    //round to nearest 1000s
    }
    getPayback(monthy_bill, system_cost);
    getTotalEnergyOutput(system_size);
    var generation = Math.ceil(100 * panel_size / area);                    //Percentage of used roof for solar panel
    $("#percentage_area").html(generation);
    $("#solar_size").html("(" + panel_size + " m<sup>2</sup>)");
    $("#total_investment").html("RM " + numberWithCommas(system_cost));
    console.log("Panel size: " + panel_size);
    console.log("System size: " + system_size);
    console.log("System cost: " + system_cost);
    return system_cost;
}

function getPayback(monthy_bill, system_cost) {
    //Factor in annual decrease in efficiency and increase in power consumption payback period in years
    var payback = Math.round(Math.log(1 - system_cost *
        (1 - ANNUAL_INCREASE_IN_POWER_CONSUMPTION * SOLAR_PANEL_DEGRADATION) / (monthy_bill * 12)) /
        Math.log(ANNUAL_INCREASE_IN_POWER_CONSUMPTION * SOLAR_PANEL_DEGRADATION));
    $("#roi_years").html(payback + " years");
    getTotalEarning(payback, system_cost);
    console.log("payback: " + payback);
    return payback;
}

function getTotalEarning(payback, system_cost) {
    //This is a very stupid way to calculate payback and need to improve in the future
    var remaining = AVERAGE_SOLAR_PANEL_LIFETIME - payback;
    var estimated_total_earning = Math.round(((system_cost * remaining) / payback) * (1 + (INCREASE_BILL_FACTOR * remaining)));
    if (isNaN(estimated_total_earning)) {
        estimated_total_earning = 0;
    }
    $("#total_earning").html("RM " + numberWithCommas(estimated_total_earning + system_cost));
    console.log(system_cost)
    console.log(estimated_total_earning)
    return estimated_total_earning;
}

function getTotalEnergyOutput(system_size) {
    var total_energy = 0;
    for (i = 0; i < AVERAGE_SOLAR_PANEL_LIFETIME; i++) {
        total_energy = total_energy + system_size * 30 * SOLAR_PANEL_DEGRADATION;
    }
    getCO2Impact(system_size);
    getTreeImpact(system_size);
    $("#total_energy").html(numberWithCommas(Math.round(total_energy)) + " kWh");
}

function getCO2Impact(system_size) {
    var co2 = Math.round(system_size * 0.5 * 10) / 10;
    $("#co2").html(co2);
}
function getTreeImpact(system_size) {
    var tree = Math.round(system_size * 12.9 * 10) / 10;
    $("#tree").html(tree);
}

//Reference: https://www.theedgemarkets.com/article/going-green-better-returns-solar-investments-expected