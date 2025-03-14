'use client';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import {useEffect, useState} from 'react';
import CitySelector from "../components/citySelector";
import dynamic from "next/dynamic";

// Disable SSR for MapDisplay
const MapDisplay = dynamic(() => import("../components/mapDisplay"), { ssr: false });




export default function Page() {
    const [selectedCity, setSelectedCity] = useState<{ name: string; lat: number; lon: number } | null>(null);
    const [clue, setClue] = useState<string>('');
    const [gameLoaded, setLoaded] = useState(false);


    // const handleSceneClick = () => {
    //     setClue("Body of John Doe was discovered! He was last seen alive near Dundas Street leaving Queen Street")
    // }

    // const handleStreetClick = (streetName: string) => {
    //     if (streetName === 'Correct Street') {
    //         setClue('You found a clue! The suspect was last seen here.');
    //     } else {
    //         setClue('This street has nothing suspicious. Try another one!');
    //     }
    // };

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("leaflet").then((L) => {
                L.Icon.Default.mergeOptions({
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                });
            });
        }
    }, []);


    return (
        <div className="relative min-h-screen w-full">
            <div className="relative min-h-[80vh] bg-black text-white">
                <CitySelector onCitySelected={setSelectedCity}/>
                {selectedCity && <MapDisplay city={selectedCity} setClue={setClue} setLoaded={setLoaded}/>}
            </div>
            {gameLoaded && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 w-[90%] max-w-3xl p-6 border border-gray-700 rounded-xl
                    text-center break-words truncate">
                    <h3 className="text-2xl font-semibold">Clue</h3>
                    <p className="text-lg font-mono">{clue}</p>
                </div>
            )}
        </div>
    );
}

// function BoundaryWarning() {
//     const map = useMap();
//     useEffect(() => {
//         map.on('moveend', () => {
//             if (!bounds.contains(map.getCenter())) {
//                 alert('Cannot move outside playable area!');
//             }
//         });
//     }, [map]);
//     return null;
// }