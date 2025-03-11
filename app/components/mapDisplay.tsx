import { useState, useEffect } from "react";
import L, { LatLngBoundsExpression } from "leaflet";
import { MapContainer, TileLayer, LayersControl, Polyline } from "react-leaflet";
import {getLocations } from "../utils/overpass";

function calculateBounds(centerLat: number, centerLon: number, radius: number): LatLngBoundsExpression {
    // Convert meters to degrees
    const latOffset = (radius / 6378150) * (180 / Math.PI); //Earth radius in meters
    const lonOffset = latOffset / Math.cos(centerLat * (Math.PI / 180));

    // Create bounding box
    return L.latLngBounds(
        [centerLat - latOffset, centerLon - lonOffset], // Southwest
        [centerLat + latOffset, centerLon + lonOffset]  // Northeast
    );
}


export default function MapDisplay({ city }: { city: { lat: number; lon: number } }) {
    const [gameData, setGameData] = useState<{clues: any; finalLoc: any; allLocations: any } | null>(null);
    const [clueIndex, setClueIndex] = useState(0);
    const [clue, setClue] = useState<string | null>(null);
    const [foundKiller, setFoundKiller] = useState(false);


    useEffect(() => {
        async function loadStreets() {
            if (city) {
                const data = await getLocations(city.lat, city.lon);
                if (data){
                    setGameData(data);
                    setClue(`Find ${data.clues[0].name}`);
                }
            }
        }
        loadStreets();
    }, [city]);


    if (!city || !gameData) {
        return <p className="text-center text-lg">Loading game data...</p>;
    }

    const handleStreetClick = (street: any) => {
        console.log(gameData.clues[clueIndex].name);
        console.log(clueIndex);
        if (!gameData) {
            return;
        }
        if (clueIndex >= 0 && clueIndex < gameData.clues.length && street.name === gameData.clues[clueIndex].name) {
            setClue(`You found a clue ${clueIndex}! Navigate to ${street.name}`);
            setClueIndex(clueIndex + 1);
        } else if (clueIndex === gameData.clues.length && street.name === gameData.finalLoc.name) {
            setClue("You found the killer! Case solved.");
            setFoundKiller(true);
        }
    };

    const bounds = calculateBounds(city.lat, city.lon,1000);

    return (
        <div className="relative min-h-screen w-full">
            <div className="relative min-h-screen bg-black text-white">
                <MapContainer center={[city.lat, city.lon]}
                              zoom={18}
                              minZoom={15}
                              maxBounds={bounds}
                              style={{height: "500px", width: "100%"}}
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
                    </LayersControl>
                    {gameData.allLocations.map((location, index) => (
                        <Polyline
                            key={index}
                            pathOptions={{ color: location.name === gameData.finalLoc.name ? "green" : "gray", weight: 4 }}
                            positions={location.coordinates}
                            eventHandlers={{
                                click: () => handleStreetClick(location),
                            }}
                        />
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}