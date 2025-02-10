// Function to fetch a random major city from OpenStreetMap
export const fetchRandomCity = async () => {
    const overpassQuery = `
    [out:json];
    area["name"="United Kingdom"]->.uk;
    node(area.uk)[place=city]["population"](if:number(t["population"]) > 10000);
    out;
  `;

    const url = `https://www.overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.elements.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.elements.length);
            const city = data.elements[randomIndex];

            return {
                name: city.tags.name,
                lat: city.lat,
                lon: city.lon,
            };
        }
    } catch (error) {
        console.error("Error fetching cities:", error);
    }
    return null;
};

// Function to fetch streets for the selected city
export const fetchCityStreets = async (cityLat: number, cityLon: number) => {
    const overpassQuery = `
    [out:json];
    way
      [highway]
      (around:250, ${cityLat}, ${cityLon});
    out geom;
  `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return data.elements.map((way: any) => ({
            name: way.tags?.name || "Unnamed Street",
            coordinates: way.geometry.map((point: any) => [point.lat, point.lon]),
        }));
    } catch (error) {
        console.error("Error fetching streets:", error);
        return [];
    }
};
