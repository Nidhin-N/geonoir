'use client';
import {MapContainer, TileLayer, Marker, Popup, LayersControl, Polygon, useMap} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import L from 'leaflet';
import {useEffect, useState} from 'react';
import CitySelector from "../components/citySelector";
import MapDisplay from "../components/mapDisplay";

//Level boundary
let northEast = L.latLng(55.862982, -4.236785),
    southWest = L.latLng(55.861212, -4.254520);
const bounds = L.latLngBounds(southWest,northEast);

//Crime Scene location
const pos1 = [55.862145, -4.245025];
const street1 = []

export default function Page() {
    const [selectedCity, setSelectedCity] = useState<{ name: string; lat: number; lon: number } | null>(null);
    const [clue, setClue] = useState('');

    const handleSceneClick = () => {
        setClue("Body of John Doe was discovered! He was last seen alive near Dundas Street leaving Queen Street")
    }

    // const handleStreetClick = (streetName: string) => {
    //     if (streetName === 'Correct Street') {
    //         setClue('You found a clue! The suspect was last seen here.');
    //     } else {
    //         setClue('This street has nothing suspicious. Try another one!');
    //     }
    // };

    useEffect(() => {
        L.Icon.Default.mergeOptions({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
    }, []);

    return (
        // <div className="relative min-h-screen w-full">
        //     <button
        //         onClick={() => window.history.back()}
        //         className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        //     >
        //         Back
        //     </button>
        //
        //         <Marker position={[55.861381,-4.248909]} eventHandlers={{click: handleSceneClick}}>
        //             <Popup>Click to investigate the crime scene.</Popup>
        //         </Marker>
        //     </MapContainer>
        //     {/* Display clues found */}
        //     <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 w-[90%] max-w-3xl p-6 border border-gray-700 rounded-xl">
        //         <h3 className="text-2xl font-semibold">Clue</h3>
        //         <p className="text-lg font-mono">{clue || 'Click on a street to investigate and find clues.'}</p>
        //     </div>
        //
        // </div>
        <div className="relative min-h-screen bg-black text-white">
            <CitySelector onCitySelected={setSelectedCity}/>
            {selectedCity && <MapDisplay city={selectedCity}/>}
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