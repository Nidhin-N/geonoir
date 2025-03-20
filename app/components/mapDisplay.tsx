import { useState, useEffect } from "react";
import {MapContainer, TileLayer, LayersControl, Polygon, Circle} from "react-leaflet";
import {getLocations } from "../utils/overpass";


export default function MapDisplay({ city, setClue, setLoaded}: {
        city: { lat: number; lon: number }
        setClue: (clue: string) => void;
        setLoaded: (loaded: boolean) => void;
    }) {
    const [gameData, setGameData] = useState<{clues: any; allLocations: any } | null>(null);
    const [clueIndex, setClueIndex] = useState(0);
    const [difficulty, setDifficulty] = useState("easy");


    useEffect(() => {
        async function loadStreets() {
            if (city) {
                const data = await getLocations(city.lat, city.lon);
                if (data){
                    setGameData(data);
                    setClue(`Find ${data.clues[0].name}`);
                    setLoaded(true);
                }
            }
        }
        loadStreets();
    }, [city]);

    useEffect(() => {
        const playerDifficulty = localStorage.getItem("difficulty");
        if (playerDifficulty) {
            setDifficulty(playerDifficulty);
        }
    }, []);


    if (!city || !gameData) {
        return <p className="text-center text-lg">Loading game data...</p>;
    }

    const handleStreetClick = (loc: any) => {
        if (!gameData) {
            return;
        }
        if (clueIndex >= 0 && clueIndex < gameData.clues.length - 1) {
            if (loc.name === gameData.clues[clueIndex].name) {
                const nextClueIndex = clueIndex + 1;
                setClue(`You found a clue! Find ${gameData.clues[nextClueIndex].name}`);
                console.log(`Updated Clue Index: ${nextClueIndex}`);
                setClueIndex(clueIndex+1);
                return;
            }
        }

        // ✅ Check if the final clue (last item in clues array) is clicked
        if (clueIndex === gameData.clues.length - 1 && loc.name === gameData.clues[clueIndex].name) {
            setClue("You found the killer! Case solved.");

            setTimeout(() => {
                window.location.reload(); // ✅ Restart game after 5 seconds
            }, 5000);

            return;
        }

    };

    // const bounds = calculateBounds(city.lat, city.lon,1000);

    return (
        <div className="relative min-h-screen w-full">
            <div className="relative min-h-screen bg-black text-white">
                <MapContainer center={[city.lat, city.lon]}
                              zoom={18}
                              minZoom={15}
                              // maxBounds={bounds}
                              style={{height: "650px", width: "100%"}}
                >
                    {/* TileLayer to display the map using OpenStreetMap tiles */}
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer name="Standard Map">
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
                    {difficulty !== "hard" && (
                    <Circle
                        center={gameData.clues[clueIndex].coordinates[0]}
                        radius={175}
                        color="blue"
                        fillColor="blue"
                        fillOpacity={0.3}
                    />
                    )}
                    {difficulty === "hard" && (
                        <Circle
                            center={gameData.clues[clueIndex].coordinates[0]}
                            radius={1000}
                            color="blue"
                            fillColor="transparent"
                        />
                    )}
                    <Polygon
                        positions={gameData.clues[clueIndex].coordinates}
                        color="transparent"
                        eventHandlers={{
                            click: () => handleStreetClick(gameData.clues[clueIndex]),
                        }}
                    />
                </MapContainer>
            </div>
        </div>
    );
}