import http from 'https';
import fs from 'fs';
import url from 'url';
import path from 'path';
import extract from 'extract-zip';
import { cwd } from 'process';
import mapshaper from 'mapshaper';

const dir_shapes = cwd() + '/shapes/';
const dir_geojson = cwd() + '/geojson/';
const dir_geojson_countries = cwd() + '/geojson/countries/';

const scales = ['10m', '50m', '110m'];

const countries_url = "https://naciscdn.org/naturalearth/scale/cultural/ne_scale_admin_0_countries.zip";
const land_url = "https://naciscdn.org/naturalearth/scale/physical/ne_scale_land.zip";
const ocean_url = "https://naciscdn.org/naturalearth/scale/physical/ne_scale_ocean.zip";

const countries_adm_url = "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip";
const continents = ['Asia', 'Europe', 'North America', 'Oceania', 'South America'];
const countries = [
 'Argentina',
 'Australia',
 'Brazil',
 'Canada',
 'China',
 'Russia',
  'Germany', 'France', 'Italy', 'Japan', 'Iceland', 'India', 'Ireland', 'Indonesia', 'Mexico', 'Netherlands', 'Saudi Arabia', 'South Africa', 'South Korea', 'Spain',
  'Turkey', 'United Kingdom', 'United States of America'];

const countries1 = [
  "Andorra",
  "United Arab Emirates",
  "Afghanistan",
  "Antigua and Barbuda",
  "Anguilla",
  "Albania",
  "Armenia",
  "Angola",
//  "Antarctica",
  "Argentina",
  "American Samoa",
  "Austria",
  "Australia",
  "Aruba",
  "Azerbaijan",
  "Bosnia and Herzegovina",
  "Barbados",
  "Bangladesh",
  "Belgium",
  "Burkina Faso",
  "Bulgaria",
  "Bahrain",
  "Burundi",
  "Benin",
  "Saint Barth�lemy",
  "Bermuda",
  "Brunei Darussalam",
  "Bolivia",
  "Caribbean Netherlands",
  "Brazil",
  "Bahamas",
  "Bhutan",
  "Bouvet Island",
  "Botswana",
  "Belarus",
  "Belize",
  "Canada",
  "Cocos (Keeling) Islands",
  "Republic of the Congo",
  "Central African Republic",
  "Dem. Rep. Congo",
  "Switzerland",
//  "Cote d'Ivoire",
  "Cook Islands",
  "Chile",
  "Cameroon",
  "China",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Cape Verde",
  "Curasao",
  "Christmas Island",
  "Cyprus",
  "Czech Republic",
  "Germany",
  "Djibouti",
  "Denmark",
  "Dominica",
  "Dominican Republic",
  "Algeria",
  "Ecuador",
  "Estonia",
  "Egypt",
  "Western Sahara",
  "Eritrea",
  "Spain",
  "Ethiopia",
  "Finland",
  "Fiji",
  "Falkland Islands (Malvinas)",
  "Federated States of Micronesia",
  "Faroe Islands",
  "France",
  "Gabon",
  "United Kingdom",
  "Grenada",
  "Georgia",
  "French Guiana",
  "Guernsey",
  "Ghana",
  "Gibraltar",
  "Greenland",
  "Gambia",
  "Guinea",
  "Guadeloupe",
  "Equatorial Guinea",
  "Greece",
  "Guatemala",
  "Guam",
  "Guinea-Bissau",
  "Guyana",
  "Hong Kong",
  "Honduras",
  "Croatia",
  "Haiti",
  "Hungary",
  "Indonesia",
  "Ireland",
  "Israel",
  "Isle of Man",
  "India",
  "Iraq",
  "Iran",
  "Iceland",
  "Italy",
  "Jersey",
  "Jamaica",
  "Jordan",
  "Japan",
  "Kenya",
  "Kyrgyzstan",
  "Cambodia",
  "Kiribati",
  "Comoros",
  "Saint Kitts and Nevis",
  "North Korea",
  "South Korea",
  "Kuwait",
  "Cayman Islands",
  "Kazakhstan",
  "Laos",
  "Lebanon",
  "Saint Lucia",
  "Liechtenstein",
  "Sri Lanka",
  "Liberia",
  "Lesotho",
  "Lithuania",
  "Luxembourg",
  "Latvia",
  "Libya",
  "Morocco",
  "Monaco",
  "Moldova",
  "Montenegro",
  "Saint Martin",
  "Madagascar",
  "Marshall Islands",
  "North Macedonia",
  "Mali",
  "Myanmar",
  "Mongolia",
  "Macao",
  "Northern Mariana Islands",
  "Martinique",
  "Mauritania",
  "Montserrat",
  "Malta",
  "Mauritius",
  "Maldives",
  "Malawi",
  "Mexico",
  "Malaysia",
  "Mozambique",
  "Namibia",
  "New Caledonia",
  "Niger",
  "Norfolk Island",
  "Nigeria",
  "Nicaragua",
  "Netherlands",
  "Norway",
  "Nepal",
  "Nauru",
  "Niue",
  "New Zealand",
  "Oman",
  "Panama",
  "Peru",
  "French Polynesia",
  "Papua New Guinea",
  "Philippines",
  "Pakistan",
  "Poland",
  "Saint Pierre and Miquelon",
  "Pitcairn",
  "Puerto Rico",
  "Palestine",
  "Portugal",
  "Palau",
  "Paraguay",
  "Qatar",
  "Reunion",
  "Romania",
  "Republic of Serbia",
  "Russia",
  "Rwanda",
  "Saudi Arabia",
  "Solomon Islands",
  "Seychelles",
  "Sudan",
  "Sweden",
  "Singapore",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Slovenia",
  "Svalbard and Jan Mayen Islands",
  "Slovakia",
  "Sierra Leone",
  "San Marino",
  "Senegal",
  "Somalia",
  "Suriname",
  "South Sudan",
  "Sao Tome and Principe",
  "El Salvador",
  "Syria",
  "Swaziland",
  "Turks and Caicos Islands",
  "Chad",
  "Togo",
  "Thailand",
  "Tajikistan",
  "Tokelau",
  "Timor-Leste",
  "Turkmenistan",
  "Tunisia",
  "Tonga",
  "Turkey",
  "Trinidad and Tobago",
  "Tuvalu",
  "Taiwan",
  "Tanzania",
  "Ukraine",
  "Uganda",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Saint Vincent and the Grenadines",
  "Venezuela",
  "Vietnam",
  "Vanuatu",
  "Samoa",
  "Kosovo",
  "Yemen",
  "Mayotte",
  "South Africa",
  "Zambia",
  "Zimbabwe"
];

const iso_codes = [
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AQ",
  "AR",
  "AS",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CC",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CW",
  "CX",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "EU",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HM",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KP",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SY",
  "SZ",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "UM",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VI",
  "VN",
  "VU",
  "WF",
  "WS",
  "XK",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW"
];

const cities_url = "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_populated_places.zip";

if (!fs.existsSync(dir_shapes)) {
  fs.mkdirSync(dir_shapes);
}
if (!fs.existsSync(dir_geojson)) {
  fs.mkdirSync(dir_geojson);
}
if (!fs.existsSync(dir_geojson_countries)) {
  fs.mkdirSync(dir_geojson_countries);
}


downloadAll(scales, countries_url, () => extractAll(scales, countries_url, (f: string) => {
  const file = f.slice(0, f.length - 4) + '.shp';
  genGeoJson(file, 'geojson/', '0.01', false,
    'this.properties = {name: this.properties.NAME, continent: this.properties.CONTINENT, pop_est:this.properties.POP_EST, label_x:this.properties.LABEL_X, label_y:this.properties.LABEL_Y, iso:this.properties.ISO_A2}',
    "this.properties.name!='Antarctica' && this.properties.pop_est > 50000"
  );

  if (file.indexOf('110m') >= 0) {
    continents.forEach((continent) => {
      genGeoJson(file, "'geojson/" + continent.replace(' ', '') + ".json'", '0.01', false,
        'this.properties = {name: this.properties.NAME, continent: this.properties.CONTINENT, pop_est:this.properties.POP_EST}',
        "this.properties.continent=='" + continent + "'");
    });
  }
}));
downloadAll(scales, land_url, () => extractAll(scales, land_url, (f: string) => {
  const file = f.slice(0, f.length - 4) + '.shp';
  genGeoJson(file, 'geojson/', '0.1', true);
}));
downloadAll(scales, ocean_url, () => extractAll(scales, ocean_url, (f: string) => {
  const file = f.slice(0, f.length - 4) + '.shp';
  genGeoJson(file, 'geojson/', '0.1', true);
}));
downloadAll(scales, cities_url, () => extractAll(scales, cities_url, (f: string) => {
  const file = f.slice(0, f.length - 4) + '.shp';
  genGeoJson(file, 'geojson/', '0.1', false,
  'this.properties = {name: this.properties.NAME, pop:this.properties.POP_MAX, iso:this.properties.ISO_A2}'
  );
}));

/*download(countries_adm_url, dir_shapes, (f) => {
  console.log(f);
  extract(f, { dir: dir_shapes }).then(() => {
    const file = f.slice(0, f.length - 4) + '.shp';
    genGeoJson(file, 'geojson/', '0.01', false);
 
    // countries.forEach((country) => {
    //   let filter = "admin=='" + country + "'" + getCountryFilter(country);
    //   genGeoJson(file, 'geojson/' + getName(country) + '.json', '0.01', false,
    //     'this.properties = {name: this.properties.name, name_local: this.properties.name_local, admin:this.properties.admin, type:this.properties.type, label_x:this.properties.longitude, label_y:this.properties.latitude}',
    //     filter, '30%');
    // });

    iso_codes.forEach((code) => {
      let filter = "iso=='" + code + "'";
      genGeoJson(file, dir_geojson_countries + code + '.json', '0.01', false,
        'this.properties = {name: this.properties.name, iso: this.properties.iso_a2, name_local: this.properties.name_local, admin:this.properties.admin, type:this.properties.type, label_x:this.properties.longitude, label_y:this.properties.latitude}',
        filter, '16%');
    });

  });
});*/

function extractAll(scales: string[], turl: string, cb: (file: string) => void) {
  const each = ' -each "this.properties = {NAME: this.properties.NAME,CONTINENT: this.properties.CONTINENT}"';
  scales.forEach(scale => {
    const shape_url = turl.split('scale').join(scale);
    const shape_file = dir_shapes + path.basename(url.parse(shape_url).pathname);
    extract(shape_file, { dir: dir_shapes }).then(() => {
      cb(shape_file);
    });
  });
}

function genGeoJson(file: string, outDir: string, precision: string, drop_table: boolean, each?: string, filter?: string, simplification?: string) {
  let eachOpt = each ? `-each "${each}"` : '';
  let filterOpt = filter ? `-filter "${filter}"` : '';
  let simplificationOpt = simplification ? `--simplify dp  ${simplification}` : '';

  let cmd = `${file} ${eachOpt} ${filterOpt} ${simplificationOpt} -o "${outDir}" format=geojson precision=${precision}`;
  if (drop_table) {
    cmd += ' drop-table';
  }

  console.log(cmd);
  mapshaper.runCommands(cmd);
}

function downloadAll(scales: string[], turl: string, cb: Function) {
  let dls = [];

  scales.forEach(scale => {
    const shape_url = turl.split('scale').join(scale);
    console.log(shape_url);
    const shape_file = path.basename(url.parse(shape_url).pathname);
    if (!fs.existsSync(dir_shapes + shape_file)) {
      dls.push(getDownloadPromise(shape_url, dir_shapes));
    }
  });

  if (dls.length) {
    Promise.all(dls).then(() => cb());
  } else {
    cb();
  }
}

function download(durl: string, dir: string, cb: Function) {
  const shape_file = dir_shapes + path.basename(url.parse(durl).pathname);
  if (!fs.existsSync(shape_file)) {
    getDownloadPromise(durl, dir).then(() => cb(shape_file));
  } else {
    cb(shape_file);
  }
}

function getDownloadPromise(surl: string, dir: string) {
  const filename = path.basename(url.parse(surl).pathname);
  console.log(filename);
  const file = fs.createWriteStream(dir + filename);

  return new Promise((resolve, reject) => {
    http.get(surl, (response) => {
      response.pipe(file);

      response.on('end', () => {
        resolve(filename);
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
  });
}

function getName(s: string) {
  if (s == 'United Kingdom') {
    return 'UK';
  }
  if (s == 'United States of America') {
    return 'US';
  }
  return s.replaceAll(' ', '');
}

function getCountryFilter(country: string) {
  //if (country == 'United States of America') {
  //  return '&& name!="Alaska" && name!="Hawaii"';
  //}
  if (country == 'Netherlands') {
    return "&& name!='St. Eustatius' && name!='Saba'";
  }
  if (country == 'Spain') {
    return "&& name!='Santa Cruz de Tenerife' && name!='Las Palmas'";
  }
  if (country == 'France') {
    return "&& type!='Overseas d�partement'";
  }
  return '';
}