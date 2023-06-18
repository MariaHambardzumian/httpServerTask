import fs from 'fs'
import path from 'path'

export default function getAllFiles(dirPath: string = './', filesList: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);
    if (path.basename(dirPath) == 'converted' && files.every(f => path.extname(path.join(dirPath, f)) == '.json')) {

        filesList.push(...files.map(fileName => path.join(dirPath, fileName)))
    }
    files
        .filter(file => fs.statSync(path.join(dirPath, file)).isDirectory())
        .forEach(dir => {

            getAllFiles(path.join(dirPath, dir), filesList);

        });

    return filesList;
}

// console.log(getAllFiles('./'));
