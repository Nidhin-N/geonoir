# GeoNoir

GeoNoir is a browser-based detective game that uses real-world geospatial data from OpenStreetMap

## Requirements
- Node.js
- npm

## Installation

```bash
git clone https://github.com/Nidhin-N/geonoir.git
cd geonoir
npm install
npm run dev #for development mode
npm run build #for production
```
Then open http://localhost:3000 in your browser.

## How to Play
1. A PC/Laptop with modern web browser and internet connection is required to play GeoNoir
2. To play the game, visit https://geonoir.vercel.app
3. On the main screen you can visit settings menu to choose and save your difficulty preference:
- Easy - No timer, all hints visible.
- Medium - Two-minute timer, all hints visible.
- Hard - Two-minute timer, no hints visible.
4. Click play to play the game and a level in a random UK city will be generated
5. The clue box at the bottom of the page will tell you the name of the location, use the hints (if on easy or medium) to find the location within the circle. 
6. If applicable the timer will show in the top right which will display time left.
7. After solving all the clues, you will complete the level.

## Technologies and Frameworks
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Leaflet.js](https://leafletjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API)

## Deployment
- Deployed using Vercel, https://vercel.com/
- Live version: https://geonoir.vercel.app

## Acknowledgements
- OpenStreetMap contributors
- Leaflet and Overpass API community