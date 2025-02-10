import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, LayersControl } from "react-leaflet";
import { fetchRandomCity, fetchCityStreets } from "../utils/overpass";

export default function MapDisplay({ city }: { city: { lat: number; lon: number } }) {
    const [streetData, setStreetData] = useState<any[]>([]);
    const [bounds, setBounds] = useState<any>(null);

    useEffect(() => {
        async function loadStreets() {
            if (city) {
                const streets = await fetchCityStreets(city.lat, city.lon);
                setStreetData(streets);
            }
        }
        loadStreets();
    }, [city]);


    return (
        <MapContainer center={[city.lat, city.lon]}
                      zoom={15}
                      minZoom={17}
                      style={{ height: "500px", width: "100%" }}
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
            {streetData.map((street, index) => (
                <Polygon key={index} pathOptions={{ color: "red" }} positions={street.coordinates} />
            ))}
        </MapContainer>
    );
}