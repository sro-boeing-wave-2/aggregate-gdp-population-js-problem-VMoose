// import continent from './continent';

const fs = require('fs');
const continent = require('./continent');

/**
 * Aggregates GDP and Population Data by Continents..
 * @param {*} filePath
 */


async function readfileasync(filePath) {
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
async function writefileasync(outfilePath, outputdata) {
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

  async function CSVToArray() {
    const bufferarray = bufferString.toString();
    const replacearray = bufferarray.replace(/['"]+/g, '');
    const splitarray = replacearray.split('\n').slice(0, -1);
    const array2 = [];
    for (let i = 0; i < splitarray.length; i += 1) {
      const row = splitarray[i].toString().split(',');
      array2.push(row);
    }
    return array2;
  }

  async function CSV2JSON(csv) {
    const array = await CSVToArray(csv);
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
  const csvarray = await CSV2JSON(bufferString);

  const continent2 = new Map(continent);
  const continentData = {};
  new Set(continent2.values()).forEach((cont) => {
    continentData[cont] = {
      GDP_2012: 0, POPULATION_2012: 0,
    };
  });
  for (let i = 0; i < continent.length; i += 1) {
    continentData[continent[i][1]].GDP_2012 += parseFloat(csvarray[i]['GDP Billions (US Dollar) - 2012']);
    continentData[continent[i][1]].POPULATION_2012 += parseFloat(csvarray[i]['Population (Millions) - 2012']);
  }
  await writefileasync(outputFile, JSON.stringify(continentData));
};
module.exports = aggregate;
