import { useState, useEffect } from "react";
import {MapContainer, TileLayer, LayersControl, Polygon, Circle} from "react-leaflet";
import {getLocations } from "../utils/overpass";

//MapDisplay component - renders map and handles clue logic and interaction events
export default function MapDisplay({ city, setClue, setLoaded}: {
        city: { lat: number; lon: number }
        setClue: (clue: string) => void;
        setLoaded: (loaded: boolean) => void;
    }) {
    //State to store the fetched locations, clues and difficulty
    const [gameData, setGameData] = useState<{clues: any; allLocations: any } | null>(null);
    const [clueIndex, setClueIndex] = useState(0);  //Set clue index
    const [difficulty, setDifficulty] = useState<"easy"|"medium"|"hard">("easy"); //Player difficulty setting

    //Fetch clue locations when component is started or city is changed
    useEffect(() => {
        async function loadStreets() {
            if (city) {
                const data = await getLocations(city.lat, city.lon); //Get locations from Overpass
                if (data){
                    setGameData(data);
                    setClue(`Find ${data.clues[0].name}`); //Set and return first clue to parent demo/page
                    setLoaded(true); //Tell parent, game is ready
                }
            }
        }
        loadStreets();
    }, [city]);

    //Get difficulty from localStorage
    useEffect(() => {
        const playerDifficulty = localStorage.getItem("difficulty") as "easy"|"medium"|"hard"; //To avoid errors
        if (playerDifficulty) {
            setDifficulty(playerDifficulty);
        }
    }, []);

    //Show loading message until city and game data are loaded
    if (!city || !gameData) {
        return <p className="text-center text-lg">Loading game data...</p>;
    }

    //Check if user found correct clue
    const handleStreetClick = (loc: any) => {
        if (!gameData) {
            return;
        }
        console.log(gameData.clues[clueIndex].name); //Test
        if (clueIndex >= 0 && clueIndex < gameData.clues.length - 1) {
            if (loc.name === gameData.clues[clueIndex].name) {
                const nextClueIndex = clueIndex + 1;
                setClue(`You found a clue! Find ${gameData.clues[nextClueIndex].name}`);
                console.log(`Updated Clue Index: ${nextClueIndex}`); //Test
                setClueIndex(clueIndex+1);
                return;
            }
        }

        //Check if the final clue is found and user found killer
        if (clueIndex === gameData.clues.length - 1 && loc.name === gameData.clues[clueIndex].name) {
            setClue("You found the killer! Case solved.");

            setTimeout(() => {
                window.location.reload(); // Restart game after 5 seconds
            }, 5000);

            return;
        }

    };


    return (
        <div className="relative min-h-screen w-full">
            <div className="relative min-h-screen bg-black text-white">
                <MapContainer center={[city.lat, city.lon]}
                              zoom={18}
                              minZoom={15}
                              // maxBounds={bounds}
                              style={{height: "650px", width: "100%"}}
                >
                    {/* TileLayer to display the map using OpenStreetMap tile */}
                    <LayersControl position="topright">
                        {/*Standard OSM layer*/}
                        <LayersControl.BaseLayer name="Standard Map">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                        {/* ESRI satellite layer*/}
                        <LayersControl.BaseLayer name="Satellite">
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                attribution='&copy; <a href="https://www.esri.com/">ESRI</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                        {/* Stamen noir light layer*/}
                        <LayersControl.BaseLayer name="Noir-light">
                            <TileLayer
                                url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
                                attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                        {/*Default Jawg noir dark layer*/}
                        <LayersControl.BaseLayer checked name="Noir-dark">
                            <TileLayer
                                url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=2TN78o146tjxRyqb9a15TyqJd9Ovny8ppJglRXXgFzqAe42EkD8wXOyNi5EOeTbk"
                                attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    {/*Display hint area as small blue circle for easy/medium*/}
                    {difficulty !== "hard" && (
                    <Circle
                        center={gameData.clues[clueIndex].coordinates[0]}
                        radius={175}
                        color="blue"
                        fillColor="blue"
                        fillOpacity={0.3}
                    />
                    )}
                    {/*Display large search area as blue circle for hard mode so users know bounds */}
                    {difficulty === "hard" && (
                        <Circle
                            center={gameData.clues[clueIndex].coordinates[0]}
                            radius={1000}
                            color="blue"
                            fillColor="transparent"
                        />
                    )}
                    {/* Invisible polygon to handle click logic for the clue area */}
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