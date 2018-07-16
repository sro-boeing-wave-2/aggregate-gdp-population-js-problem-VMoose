const fs = require('fs');

const outputFile = './output/output.json';

const continentpath = 'continent.json';
/**
 * Aggregates GDP and Population Data by Continents..
 * @param {*} filePath
 */

function readfileasync(filePath) {
  return new Promise(((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }));
}
function writefileasync(outfilePath, outputdata) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outfilePath, outputdata, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

const aggregate = filePath => new Promise((resolve, reject) => {
  Promise.all([readfileasync(filePath), readfileasync(continentpath)]).then((values) => {
    const continentdata = JSON.parse(values[1]);
    const csvData = values[0];
    const processCsvData = (csvData.replace(/['"]+/g, '')).split('\n');
    const CountryIndex = processCsvData[0].split(',').indexOf('Country Name');
    const GdpIndex = processCsvData[0].split(',').indexOf('GDP Billions (US Dollar) - 2012');
    const PopulationIndex = processCsvData[0].split(',').indexOf('Population (Millions) - 2012');
    const aggregateData = {};
    processCsvData.forEach((row) => {
      const cells = row.split(',');
      if (continentdata[cells[CountryIndex]] !== undefined) {
        const continentName = continentdata[cells[CountryIndex]];
        if (aggregateData[continentName] === undefined) {
          aggregateData[continentName] = {};
          aggregateData[continentName].GDP_2012 = parseFloat(cells[GdpIndex]);
          aggregateData[continentName].POPULATION_2012 = parseFloat(cells[PopulationIndex]);
        } else {
          aggregateData[continentName].GDP_2012 += parseFloat(cells[GdpIndex]);
          aggregateData[continentName].POPULATION_2012 += parseFloat(cells[PopulationIndex]);
        }
      }
    });
    writefileasync(outputFile, JSON.stringify(aggregateData)).then(() => {
      resolve();
    }).catch((error) => {
      reject(error);
    });
  }).catch((error) => {
    reject(error);
  });
});
module.exports = aggregate;
