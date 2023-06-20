import http, { IncomingMessage, ServerResponse } from 'http';
import exportFiles from './convertCsvToJson';
import getFile, { readFile } from './getAllConvertedJsons';
import deleteFile from './deleteFile';


const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

  switch (true) {
    case req.url == '/exports' && req.method == 'POST':
      exportFiles(req, res)
      break;

    case req.url == '/files' && req.method == 'GET':
      const all = JSON.stringify(getFile())
      res.end(all)
      break

      
    case req.url?.startsWith('/files/') && req.method == 'GET':

      if (typeof (req.url) == 'string') {
        let fileName = getFileName(req.url)
        try {
          res.end(readFile(fileName))
        } catch (error) {
          res.end(error)
        }

      }
      break


    case req.url?.startsWith('/files/') && req.method == 'DELETE':


      if (typeof (req.url) == 'string') {
        let fileName = getFileName(req.url)
        try {
          res.end(deleteFile(fileName))
        } catch (error) {
          res.end(error)
        }

      }
      break


    default:
      res.end('Try another request')
      break;
  }


});

function getFileName(url: string): string {
  return url.slice(7)
}

const port = 3001;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
