// Function to fetch a random major city from OpenStreetMap using Overoass
export const getCity = async () => {

    //Overpass query to get UK cities with population over 10,000
    const overpassQuery = `
    [out:json];
    area["name"="United Kingdom"]->.uk;
    node(area.uk)[place=city]["population"](if:number(t["population"]) > 10000);
    out;
  `;

    //Overpass API url
    const url = `https://www.overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    //POST and FETCH, then parse response
    const response = await fetch(url);
    const data = await response.json();

    // Randomly select one of the returned cities
    if (data.elements.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.elements.length);
        const city = data.elements[randomIndex];

        // Get city name and coordinates
        const name = city.tags.name
        const lat = city.lat
        const lon = city.lon

        //Return as city object
        const cityData = {name, lat, lon}
        return cityData;
    }
    //If no response then return null
    return null;
};

// Function to fetch locations for the selected city
export const getLocations = async (cityLat: number, cityLon: number) => {

    // Query to retrieve parks, attractions and key buildings around the city
    const overpassQuery = `
    [out:json];
    (
        way["leisure"="park"](around:1000, ${cityLat}, ${cityLon});
        way["tourism"="attraction"](around:1000, ${cityLat}, ${cityLon});
        way["building"~"monument|public|church|cathedral|museum|castle|government|tower|theatre|university"](around:1000, ${cityLat}, ${cityLon});
    );
    out geom;
  `;

    //Overpass API url
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    //POST and FETCH, then parse response
    console.log("Fetching locations from Overpass...");
    const response = await fetch(url);
    const data = await response.json();

    // If results are found, then are filtered and processed
    if (data.elements.length > 0) {
        let locations = data.elements
            //Filter for named elements with valid co-ordinates to avoid errors
            .filter((way: any) => way.geometry && way.tags?.name)
            .map((way: any) => ({
                name: way.tags.name,
                coordinates: way.geometry.map((point: any) => [point.lat, point.lon]),
        }));

        //Make sure there are more than 6 locations (the minimum for gameplay)
        if (locations.length >= 6) {
            // Select 6 random locations to ensure levels aren't the same in cities.
            locations = locations.sort(() => Math.random() - 0.5).slice(0, 6);

            // Held in clues array
            const clues = locations.slice(0, 6);

            return {clues, allLocations: locations};

        } else {
            console.warn("Not enough locations found.");
            return null;
        }

    } else {
        console.warn("No locations found.");
        return null;
    }
};