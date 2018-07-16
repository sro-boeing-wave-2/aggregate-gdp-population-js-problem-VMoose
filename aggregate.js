const fs = require('fs');
const continent = require('./continent');

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

const aggregate = async (filePath) => {
  const bufferString = await readfileasync(filePath);
  const outputFile = './output/output.json';

  function CSVTo2dArray() {
    const bufferarray = bufferString.replace(/['"]+/g, '').split('\n').slice(0, -1);
    const array2D = [];
    for (let i = 0; i < bufferarray.length; i += 1) {
      const arrayrow = bufferarray[i].toString().split(',');
      array2D.push(arrayrow);
    }
    return array2D;
  }

  async function Csv2ObjArray(csv) {
    const array = await CSVTo2dArray(csv);
    const objArray = [];
    for (let i = 1; i < array.length; i += 1) {
      objArray[i - 1] = {};
      for (let k = 0; k < array[0].length && k < array[i].length; k += 1) {
        const key = array[0][k];
        objArray[i - 1][key] = array[i][k];
      }
    }
    return objArray;
  }
  const csvobjarray = await Csv2ObjArray(bufferString);

  const continentData = {};
  new Set(Object.values(continent)).forEach((cont) => {
    continentData[cont] = {
      GDP_2012: 0, POPULATION_2012: 0,
    };
  });
  for (let i = 0; i < Object.keys(continent).length; i += 1) {
    continentData[Object.entries(continent)[i][1]].GDP_2012 += parseFloat(csvobjarray[i]['GDP Billions (US Dollar) - 2012']);
    continentData[Object.entries(continent)[i][1]].POPULATION_2012 += parseFloat(csvobjarray[i]['Population (Millions) - 2012']);
  }
  await writefileasync(outputFile, JSON.stringify(continentData));
};
aggregate('./data/datafile.csv');
module.exports = aggregate;
