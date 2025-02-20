import { useState, useEffect } from "react";
import {MapContainer, TileLayer, Polygon, LayersControl, Polyline} from "react-leaflet";
import {getCity, getStreets} from "../utils/overpass";

export default function MapDisplay({ city }: { city: { lat: number; lon: number } }) {
    const [gameData, setGameData] = useState<{clues: any[]; finalLoc: any; allStreets: any[] } | null>(null);
    const [clueIndex, setClueIndex] = useState(0);
    const [clue, setClue] = useState<string | null>(null);
    const [foundKiller, setFoundKiller] = useState(false);

    // useEffect(() => {
    // //     loadGame(forceNew);
    // // }, [forceNew]);
    // //
    async function loadGame(forceNew = false) {
        const selectedCity = await getCity(forceNew);
        city = selectedCity;

        if (selectedCity) {
            const data = await getStreets(selectedCity.lat, selectedCity.lon, forceNew);
            if (data) {
                setGameData(data);
            }
        }
    }


    if (!city) {
        return <p className="text-center text-lg">Loading game data...</p>;
    }
    // else if (!gameData){
    //     return <p className="text-center text-lg">Loading city ...</p>;
    // }

    const handleStreetClick = (street: any) => {
        if (!gameData) {
            return;
        }
        if (clueIndex >= 0 && clueIndex < gameData.clues.length && street.name === gameData.clues[clueIndex - 1].name) {
            setClue(`You found a clue ${clueIndex}! Navigate to ${street.name}`);
            setClueIndex(clueIndex + 1);
        } else if (clueIndex === gameData.clues.length && street.name === gameData?.finalLoc.name) {
            setClue("You found the killer! Case solved.");
            setFoundKiller(true);
        }
    };

    return (
        <div className="relative min-h-screen w-full">
            <div className="relative min-h-screen bg-black text-white">
                <MapContainer center={[city.lat, city.lon]}
                              zoom={13}
                              minZoom={18}
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
                </MapContainer>
            </div>
                <button
                    onClick={() => loadGame(true)}
                    className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700">
                    Restart Game
                </button>
            </div>
            );
            }