const fs = require('fs');

/**
 * Aggregates GDP and Population Data by Continents..
 * @param {*} filePath
 */
const aggregate = (filePath) => {
  const bufferString = fs.readFileSync(filePath, 'utf8');
  const outputFile = './output/output.json';

  function CSVToArray() {
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

  function CSV2JSON(csv) {
    const array = CSVToArray(csv);
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
  const csvarray = CSV2JSON(bufferString);


  const continent = [['Argentina', 'South America'],
    ['Australia', 'Oceania'],
    ['Brazil', 'South America'],
    ['Canada', 'North America'],
    ['China', 'Asia'],
    ['France', 'Europe'],
    ['Germany', 'Europe'],
    ['India', 'Asia'],
    ['Indonesia', 'Asia'],
    ['Italy', 'Europe'],
    ['Japan', 'Asia'],
    ['Mexico', 'North America'],
    ['Russia', 'Asia'],
    ['Saudi Arabia', 'Asia'],
    ['South Africa', 'Africa'],
    ['Republic of Korea', 'Asia'],
    ['Turkey', 'Asia'],
    ['United Kingdom', 'Europe'],
    ['USA', 'North America']];

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

  fs.writeFileSync(outputFile, JSON.stringify(continentData));
};
module.exports = aggregate;
