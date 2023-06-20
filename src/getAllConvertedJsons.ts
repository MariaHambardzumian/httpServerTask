import fs from 'fs'
import path from 'path'
import { IncomingMessage, ServerResponse } from 'http'


export function getAllFilesPaths(dirPath: string = './', filesList: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);
    if (path.basename(dirPath) == 'converted' && files.every(f => path.extname(path.join(dirPath, f)) == '.json')) {

        filesList.push(...files.map(fileName => path.join(dirPath, fileName)))
    }
    files
        .filter(file => fs.statSync(path.join(dirPath, file)).isDirectory())
        .forEach(dir => {

            getAllFilesPaths(path.join(dirPath, dir), filesList);
        });

    return filesList;
}


export function readFile(fileName: string) {
    const filePath = getFile(fileName)
    if (!filePath) {
        return 'No such file'
    } 
    else if( typeof(filePath) == 'string') {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                throw err.toString()
            }
            return data.toString()

        })
    }
    else {
        return 'Pass the fileName'
    }
}

export default function getFile(fileName?: string): (string[] | string | undefined) {
    if (!fileName) {
        return getAllFilesPaths().map(filpath => path.basename(filpath))
    }

    return getAllFilesPaths().find(fname => path.basename(fname) == fileName) 

}



// console.log(getAllFiles('./'));
