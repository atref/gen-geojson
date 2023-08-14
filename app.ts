
import fs from 'fs';
import extract from 'extract-zip';
import { iso_codes } from './codes';
import { dir_shapes, dir_geojson, dir_geojson_continents, dir_geojson_countries, extractAll,
  download, downloadAll, genGeoJson } from './utils';

// source url's
const countries_url = "https://naciscdn.org/naturalearth/scale/cultural/ne_scale_admin_0_countries.zip";
const land_url = "https://naciscdn.org/naturalearth/scale/physical/ne_scale_land.zip";
const ocean_url = "https://naciscdn.org/naturalearth/scale/physical/ne_scale_ocean.zip";
const cities_url = "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_populated_places.zip";
const countries_adm_url = "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip";

const continents = ['Asia', 'Europe', 'North America', 'Oceania', 'South America'];
const scales = ['10m', '50m', '110m'];

if (!fs.existsSync(dir_shapes)) {
  fs.mkdirSync(dir_shapes);
}
if (!fs.existsSync(dir_geojson)) {
  fs.mkdirSync(dir_geojson);
}
if (!fs.existsSync(dir_geojson_countries)) {
  fs.mkdirSync(dir_geojson_countries);
}
if (!fs.existsSync(dir_geojson_continents)) {
  fs.mkdirSync(dir_geojson_continents);
}

// countries
downloadAll(scales, countries_url, () => extractAll(scales, countries_url, (f: string, scale:string) => {
  const file = f.slice(0, f.length - 4) + '.shp';
  genGeoJson(file, `geojson/countries_${scale}.json`, '0.01', false,
    'this.properties = {name: this.properties.NAME, continent: this.properties.CONTINENT, pop_est:this.properties.POP_EST, label_x:this.properties.LABEL_X, label_y:this.properties.LABEL_Y, iso:this.properties.ISO_A2}',
    "this.properties.name!='Antarctica' && this.properties.pop_est > 50000"
  );

  if (file.indexOf('110m') >= 0) {
    // countries by continent
    continents.forEach((continent) => {
      console.log(dir_geojson_continents + continent.replace(' ', '') + ".json'");
      genGeoJson(file, "geojson/continents/" + continent.replace(' ', '') + ".json", '0.01', false,
        'this.properties = {name: this.properties.NAME, continent: this.properties.CONTINENT, pop_est:this.properties.POP_EST}',
        "this.properties.continent=='" + continent + "'");
    });
  }
}));

// land
downloadAll(scales, land_url, () => extractAll(scales, land_url, (f: string, scale:string) => {
  const file = f.slice(0, f.length - 4) + '.shp';
  genGeoJson(file, `geojson/land_${scale}.json`, '0.1', true);
}));

// ocean
downloadAll(scales, ocean_url, () => extractAll(scales, ocean_url, (f: string, scale:string) => {
  const file = f.slice(0, f.length - 4) + '.shp';
  genGeoJson(file, `geojson/ocean_${scale}.json`, '0.1', true);
}));

// cities
download(cities_url, dir_shapes, (f) => { 
  extract(f, { dir: dir_shapes }).then(() => {
    const file = f.slice(0, f.length - 4) + '.shp';
    genGeoJson(file, 'geojson/cities.json', '0.1', false,
    'this.properties = {name: this.properties.NAME, pop:this.properties.POP_MAX, iso:this.properties.ISO_A2}');
  })
});

// administrative division by country
// CPU and RAM hungry
download(countries_adm_url, dir_shapes, (f) => {
  console.log(f);
  extract(f, { dir: dir_shapes }).then(() => {
    const file = f.slice(0, f.length - 4) + '.shp';
    genGeoJson(file, 'geojson/', '0.01', false);
    iso_codes.forEach((code) => {
      let filter = "iso=='" + code + "'";
      genGeoJson(file, dir_geojson_countries + code + '.json', '0.01', false,
        'this.properties = {name: this.properties.name, iso: this.properties.iso_a2, name_local: this.properties.name_local, admin:this.properties.admin, type:this.properties.type, label_x:this.properties.longitude, label_y:this.properties.latitude}',
        filter, '16%');
    });
  });
});