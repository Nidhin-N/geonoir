'use client';
// import {MapContainer, TileLayer, Marker, Popup, LayersControl, Polygon, useMap} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import {useEffect, useState} from 'react';
import CitySelector from "../components/citySelector";
import dynamic from "next/dynamic";

// Disable SSR for MapDisplay
const MapDisplay = dynamic(() => import("../components/mapDisplay"), { ssr: false });




export default function Page() {
    const [selectedCity, setSelectedCity] = useState<{ name: string; lat: number; lon: number } | null>(null);
    const [clue] = useState('');


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
            <div className="relative min-h-screen bg-black text-white">
                <CitySelector onCitySelected={setSelectedCity}/>
                {selectedCity && <MapDisplay city={selectedCity}/>}
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 w-[90%] max-w-3xl p-6 border border-gray-700 rounded-xl">
                <h3 className="text-2xl font-semibold">Clue</h3>
                <p className="text-lg font-mono">{clue || 'Click on a street to investigate and find clues.'}</p>
            </div>
            {/*<button*/}
            {/*    onClick={restartGame}*/}
            {/*    className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700"*/}
            {/*>*/}
            {/*    Restart Game*/}
            {/*</button>*/}
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