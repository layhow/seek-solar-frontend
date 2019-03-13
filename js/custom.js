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

//_________ Constant _____________
var SOLAR_PANEL_EFFICIENCY = 0.187;     //PV solar panel efficiency from https://www.solarpowerrocks.com/solar-basics/how-much-electricity-does-a-solar-panel-produce/
var USABLE_ROOF_AREA = 0.75;            //Setback for unusable roof area
var AVERAGE_SOLAR_PANEL_LIFETIME = 50;  //Lifespan for PV solar panel in years
var TARIFF_DOMESTIC = 0;
var ICPT = 0.0225;                      //Imbalance Cost Pass-Through (ICPT) RM/kWh  **For Future Use
var SERVICE_CHARGE = 0.06;              //Electric bill service charge
var DEMO_SOLAR_RADIATION = 18.54;       //Amount of solar radiation megajoules per day
var SOLAR_PANEL_DEGRADATION = 1/1.01    //Solar Panel degradation per year


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
function billTokWh() {

}

function demoTotalEnergy() {
    //Annual Energy = Solar Radiation(MJ/m2/day) * Area(m2) * days
    return Math.round(DEMO_SOLAR_RADIATION * getPolygonArea(drawPolygon(demoPolygonCoord()).getPath()) * 365);
}

function kWhToRM(tariff,kWh) {
    var total_RM = 0;
    if(tariff == 0) {
        if(kWh < 201) {
            total_RM = Math.round(kWh * 0.218);
        }
        else if(kWh > 200 && kWh < 301) {
            total_RM = Math.round((200 * 0.218) + ((kWh - 200) * 0.334));
        }
        else if (kWh > 300 && kWh < 601) {
            total_RM = Math.round((200 * 0.218) + (100 * 0.334) + ((kWh - 300) * 0.516));
        }
        else if (kWh > 600 && kWh < 901) {
            total_RM = Math.round((200 * 0.218) + (100 * 0.334) + (300 * 0.516) + ((kWh - 600) * 0.546));
        }
        else {
            total_RM = Math.round((200 * 0.218) + (100 * 0.334) + (300 * 0.516) + (300 * 0.546) +((kWh - 900) * 0.571));
        }
        console.log("kWh: " + kWh)
        console.log("RM " + total_RM);
        return total_RM = total_RM + (total_RM * SERVICE_CHARGE);
    }
}

function getMaxEarning() {
    var total_energy_on_roof_per_day = (DEMO_SOLAR_RADIATION * 0.277777778) * getPolygonArea(drawPolygon(demoPolygonCoord()).getPath())     //kWH/day
    var total_energy_per_month = total_energy_on_roof_per_day * 30;
    var total_energy_generated_by_panel_per_month = total_energy_per_month * SOLAR_PANEL_EFFICIENCY;
    var total_earning_based_on_tnb_per_month = kWhToRM(TARIFF_DOMESTIC, total_energy_generated_by_panel_per_month);
    var maxEarning = 0;
    for(i = 0; i < AVERAGE_SOLAR_PANEL_LIFETIME; i++) {
        maxEarning = maxEarning + (total_earning_based_on_tnb_per_month * 12 * SOLAR_PANEL_DEGRADATION);
    }
    return Math.round(maxEarning);
}


//___________ Util _____________
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}