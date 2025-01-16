'use client';
import {MapContainer, TileLayer, Marker, Popup, LayersControl, Polygon, useMap} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import L from 'leaflet';
import {useEffect, useState} from 'react';
import Link from "next/link";

//Level boundary
let northEast = L.latLng(55.862982, -4.236785),
    southWest = L.latLng(55.861212, -4.254520);
const bounds = L.latLngBounds(southWest,northEast);

//Crime Scene location
const pos1 = [55.862145, -4.245025];
const street1 = []

export default function Page() {
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
            <div className="min-h-screen w-full flex justify-center">
                <MapContainer
                    center={[55.862145, -4.245025]} // Center of the map [latitude, longitude]
                    zoom={17} // Initial zoom level
                    style={{height: '700px', width: '100%'}} // Set map dimensions
                    maxBounds={bounds}
                    minZoom={17}
                >
                    {/* TileLayer to display the map using OpenStreetMap tiles */}
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="Standard Map">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>

                        <LayersControl.BaseLayer name="Satellite">
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                attribution='&copy; <a href="https://www.esri.com/">ESRI</a> contributors'
                            />
                        </LayersControl.BaseLayer>

                        <LayersControl.BaseLayer name="Noir-light">
                            <TileLayer
                                url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
                                attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer checked name="Noir-dark">
                            <TileLayer
                                url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=2TN78o146tjxRyqb9a15TyqJd9Ovny8ppJglRXXgFzqAe42EkD8wXOyNi5EOeTbk"
                                attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                        {/* Marker for crime scene */}
                    </LayersControl>

                    <Marker position={[55.861381,-4.248909]} eventHandlers={{click: handleSceneClick}}>
                        <Popup>Click to investigate the crime scene.</Popup>
                    </Marker>
                </MapContainer>
                {/* Display clues found */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 w-[90%] max-w-3xl p-6 border border-gray-700 rounded-xl">
                    <h3 className="text-2xl font-semibold">Clue</h3>
                    <p className="text-lg font-mono">{clue || 'Click on a street to investigate and find clues.'}</p>
                </div>

            </div>
        // </div>
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