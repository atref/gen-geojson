# gen-geojson

Generates a set of GeoJSON-files for the bubble-map demo https://github.com/atref/bubble-map.

How to run
```
  npm -i && npm run start
```
It should take several minutes to generate all files and the process can be memory hungry (8Gb RAM should be enough).

The script downloads the shapefiles from [Natural Earth public domain data](https://www.naturalearthdata.com/downloads/), simplifies and converts them to GeoJSON format using [MapShaper](https://github.com/mbloch/mapshaper). The following set of GeoJSON files is created in **geojson** folder:

 * List of cities
   - cities.json
 * Land (different scales) - land polygons including major islands
    - land_10m.json
    - land_50m.json
    - land_110m.json
 * Ocean (different scales) - ocean polygons split into contiguous pieces
    - land_10m.json
    - land_50m.json
    - land_110m.json
 * All countries (different scales)
    - countries_10m.json
    - countries_50m.json
    - countries_110m.json
 * Countries by continent (continents folder)
 * Country administrative divisions (countries folder)
    - the files named by 2-letter country code (ISO 3166-1 alpha-2)

The GeoJSON-files are optimized for web usage and can be used for creating various vector maps and charts. Here are some demos:
* [Scatter Map](https://www.grapecity.com/wijmo/demos/Map/ScatterMap/purejs)
* [US Choropleth](https://www.grapecity.com/wijmo/demos/Map/USChoropleth/purejs)
* [Bubble Map 1](https://www.grapecity.com/wijmo/demos/Map/BubbleMap/purejs)
* [Bubble Map 2](https://bubble-map.demo.atref.dev/)
* [Geo Dashboard](https://www.grapecity.com/wijmo/demos/reference-samples/GeoDashboard/react/dist/) 
