// Function to fetch a random major city from OpenStreetMap
export const getCity = async () => {


    // const cacheKey = "cachedCity";
    // const cachedCity = localStorage.getItem(cacheKey);
    //
    // if (cachedCity && !forceNew) {
    //     console.log("Using cached city.");
    //     return JSON.parse(cachedCity);
    // }

    const overpassQuery = `
    [out:json];
    area["name"="United Kingdom"]->.uk;
    node(area.uk)[place=city]["population"](if:number(t["population"]) > 10000);
    out;
  `;

    const url = `https://www.overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.elements.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.elements.length);
        const city = data.elements[randomIndex];

        const name = city.tags.name
        const lat = city.lat
        const lon = city.lon

        const cityData = {name, lat, lon}

        // localStorage.setItem(cacheKey, JSON.stringify(cityData));
        return cityData;
    }
    return null;
};

// Function to fetch streets for the selected city
export const getLocations = async (cityLat: number, cityLon: number) => {


    const overpassQuery = `
    [out:json];
    (
        way["leisure"="park"](around:1000, ${cityLat}, ${cityLon});
        way["tourism"="attraction"](around:1000, ${cityLat}, ${cityLon});
        way["building"~"monument|public|church|cathedral|museum|castle|government|tower|theatre|university"](around:1000, ${cityLat}, ${cityLon});
    );
    out geom;
  `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    console.log("Fetching locations from Overpass...");
    const response = await fetch(url);
    const data = await response.json();

    if (data.elements.length > 0) {
        let locations = data.elements
            .filter((way: any) => way.geometry && way.tags?.name)
            .map((way: any) => ({
                name: way.tags.name,
                coordinates: way.geometry.map((point: any) => [point.lat, point.lon]),
        }));

        if (locations.length >= 6) {
            locations = locations.sort(() => Math.random() - 0.5).slice(0, 6);

            const clues = locations.slice(0, 5); // Middle streets hold clues
            const finalLoc = locations[5];

            // Store bounds for use in the map
            return {clues, finalLoc, allLocations: locations};

        } else {
            console.warn("Not enough locations found.");
            return null;
        }

    } else {
        console.warn("No locations found.");
        return null;
    }
};