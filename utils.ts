import http from 'https';
import fs from 'fs';
import url from 'url';
import path from 'path';
import extract from 'extract-zip';
import mapshaper from 'mapshaper';
import { cwd } from 'process';

// folder paths
export const dir_shapes = cwd() + '/shapes/';
export const dir_geojson = cwd() + '/geojson/';
export const dir_geojson_continents = cwd() + '/geojson/continents/';
export const dir_geojson_countries = cwd() + '/geojson/countries/';

export function extractAll(scales: string[], turl: string, cb: (file: string, scale:string) => void): void {
  const each = ' -each "this.properties = {NAME: this.properties.NAME,CONTINENT: this.properties.CONTINENT}"';
  scales.forEach(scale => {
    const shape_url = turl.split('scale').join(scale);
    const shape_file = dir_shapes + path.basename(url.parse(shape_url).pathname);
    extract(shape_file, { dir: dir_shapes }).then(() => {
      cb(shape_file, scale);
    });
  });
}

export function genGeoJson(file: string, outDir: string, precision: string, drop_table: boolean, each?: string, filter?: string, simplification?: string) {
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

export function downloadAll(scales: string[], turl: string, cb: Function) {
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

export function download(durl: string, dir: string, cb: Function) {
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
