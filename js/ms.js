mapboxgl.accessToken = 'pk.eyJ1IjoicGhvZWJlbWFjZSIsImEiOiJjbG90MnNjMjAwNWY2MmtwOHluMHdjZHRoIn0.vDae-PruyT9blxumGPysTg'

let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    zoom: 2.5, // starting zoom
    center: [-98, 39] // starting center
});

//fetch geojson files and assign them to names
let response, shootings, usa, table;
async function geojsonFetch() {
    response = await fetch('assets/shootings.geojson');
    shootings = await response.json();
    response = await fetch('assets/us-states.json');
    usa = await response.json();
    table = document.getElementsByTagName("table")[0];
};

async function init() {
    await geojsonFetch();

    //load data to the map as new layers and table on the side.
    map.on('load', function loadingData() {

        map.addSource('shootings', {
            type: 'geojson',
            data: shootings
        });

        map.addLayer({
            'id': 'shootings-layer',
            'type': 'circle',
            'source': 'shootings',
            'paint': {
                'circle-radius': 4,
                'circle-stroke-width': 0.5,
                'circle-color': 'red',
                'circle-stroke-color': 'white'
            }
        });


        map.addSource('usa', {
            type: 'geojson',
            data: usa
        });

        map.addLayer({
            'id': 'usa-layer',
            'type': 'fill',
            'source': 'usa',
            'paint': {
                'fill-color': '#0080ff', // blue color fill
                'fill-opacity': 0.25
            }
        });

    });

    //selects table element from index and declares variables
    let row, cell1, cell2, cell3, cell4;
    for (let i = 0; i < shootings.features.length; i++) {
        // Create an empty <tr> element and add it to the 1st position of the table:
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell4 = row.insertCell(3);
        cell1.innerHTML = shootings.features[i].properties.title;
        cell2.innerHTML = shootings.features[i].properties.location;
        cell3.innerHTML = shootings.features[i].properties.total_fatalities;
        cell4.innerHTML = shootings.features[i].properties.date;
    }
}
init();

//add sorting function to button
let btn = document.getElementsByTagName("button")[0];

btn.addEventListener('click', sortTable);

// define the function to sort table
function sortTable(e) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementsByTagName("table")[0];
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = parseFloat(rows[i].getElementsByTagName("td")[2].innerHTML);
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[2].innerHTML);
            //check if the two rows should switch place:
            if (x < y) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
