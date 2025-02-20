// Function to fetch a random major city from OpenStreetMap
export const getCity = async (forceNew = false) => {

    const cacheKey = "cachedCity";
    const cachedCity = localStorage.getItem(cacheKey);

    if (cachedCity && !forceNew) {
        console.log("Using cached city.");
        return JSON.parse(cachedCity);
    }

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

        localStorage.setItem(cacheKey, JSON.stringify(cityData));
        return cityData;
    }
    return null;
};

// Function to fetch streets for the selected city
export const getStreets = async (cityLat: number, cityLon: number, forceNew = false) => {
    const cacheKey = `streets_${cityLat}_${cityLon}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData && !forceNew) {
        console.log("Using cached streets data.");
        return JSON.parse(cachedData);
    }

    const overpassQuery = `
    [out:json];
    way
      ["highway"~"^(trunk|primary|secondary|tertiary)$"]
      (around:500, ${cityLat}, ${cityLon});
    out geom;
  `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    console.log("Fetching streets from Overpass...");
    const response = await fetch(url);
    const data = await response.json();

    if (data.elements.length > 0) {
        let streets = data.elements.map((way: any) => ({
            name: way.tags?.name || "Unnamed Street",
            coordinates: way.geometry.map((point: any) => [point.lat, point.lon]),
        }));

        if (streets.length >= 6) {
            streets = streets.sort(() => Math.random() - 0.5).slice(0, 6);

            const clues = streets.slice(0, 5); // Middle streets hold clues
            const finalLoc = streets[5];

            const gameData = {clues, finalLoc, allStreets: streets };
            localStorage.setItem(cacheKey, JSON.stringify(gameData));
            return gameData;
        } else {
            console.warn("Not enough streets found.");
            return null;
        }

    } else {
        console.warn("No streets found.");
        return [];
    }
};