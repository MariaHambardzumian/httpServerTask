import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

const dirname = process.argv[2];

export default function convert(dirname:string) : string{
  const files = fs.readdirSync(dirname).filter((file) => {
    return path.extname(file) == '.csv';
  });
  
  if (!files.length) {
    throw new Error('no such file(s)');
  }
  
  for (let i = 0; i < files.length; i++) {
    parseData(i);
  }
  
  function parseData(num: number) {
    const results: object[] = [];
    const file: string = path.resolve(dirname, files[num])
  
    return new Promise((resolve, reject) => {
      fs.createReadStream(file)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          const jsonData = JSON.stringify(results);
  
          let outputFile = path.resolve(dirname, 'converted');
  
          let fileName = `${path.basename(files[num], '.csv')}.json`;
  
          if (!fs.existsSync(outputFile)) {
            fs.mkdirSync(outputFile);
          }
  
          fs.writeFile(path.join(outputFile, fileName), jsonData, (err) => {
            if (err) {
              reject('Error writing JSON file: ' + err);
            } else {
              resolve(results);
            }
          });
        })
        .on('error', (error) => {
          reject('Error writing JSON file: ' + error);
        });
    });
  }
  return 'Completed'
}
