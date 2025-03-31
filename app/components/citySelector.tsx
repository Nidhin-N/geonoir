import { useState, useEffect } from "react";
import { getCity } from "../utils/overpass";

//CitySelector (helper) component - calls the overpass api and passes it to demo/page component
export default function CitySelector({ onCitySelected }: { onCitySelected: (city: any) => void }) {
    //Holds the city object {name, lat, long}
    const [currentCity, setCurrentCity] = useState<{ name: string; lat: number; lon: number } | null>(null);
    //Error state to handle failed fetches
    const [error, setError] = useState(false);

    //Load city once on component start
    useEffect(() => {
        async function loadCity() {
            const city = await getCity(); //Call Overpass component to fetch city
            if (city) {
                setCurrentCity(city); //update local state
                onCitySelected(city); //pass city to demo/page component
            } else {
                setError(true); //set error if no city returned
            }
        }
        loadCity();
    }, []);

    //If an error occured, show error message and reload page
    if (error) return <p className="text-red-500">Error fetching city. Please refresh.</p>;
    //While loading show message
    if (!currentCity) return <p className="text-white text-center text-2xl p-4">Loading random city...</p>;

    //Once loaded show selected city name in demo/page.tsx
    return (
        <h2 className="text-white text-center text-2xl p-4">
            Investigate in {currentCity.name}
        </h2>
    );
}