import getFile from './getAllConvertedJsons';
import fs from 'fs'

export default function deleteFile(fileName:string) {
    const filePath = getFile(fileName)
    if (!filePath) {
        return 'No such file'
    } 
    else if( typeof(filePath) == 'string'){
        fs.unlink(filePath, (err) => {
          if (err) {
           throw err
          }
      
       return `File ${fileName} has been deleted`
        });
      }
      else {
        return 'Pass the fileName'
    }
}
