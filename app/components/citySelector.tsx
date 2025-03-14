import { useState, useEffect } from "react";
import { getCity } from "../utils/overpass";

export default function CitySelector({ onCitySelected }: { onCitySelected: (city: any) => void }) {
    const [currentCity, setCurrentCity] = useState<{ name: string; lat: number; lon: number } | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadCity() {
            const city = await getCity();
            if (city) {
                setCurrentCity(city);
                onCitySelected(city);
            } else {
                setError(true);
            }
        }
        loadCity();
    }, []);

    if (error) return <p className="text-red-500">Error fetching city. Please refresh.</p>;
    if (!currentCity) return <p>Loading random city...</p>;

    return (
        <h2 className="text-white text-center text-2xl p-4">
            Investigate in {currentCity.name}
        </h2>
    );
}