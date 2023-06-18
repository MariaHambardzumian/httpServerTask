import http, { IncomingMessage, ServerResponse } from 'http';
import convert from './convert'
import getAllFiles from './getAllConvertedJsons';
import path from 'path';
import fs from 'fs';
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

  switch (true) {
    case req.url == '/exports' && req.method == 'POST':
      let reqBody = ''

      req.on('data', (chunk) => {
        reqBody += chunk
      });

      req.on('end', () => {
        try {
          const { directory } = JSON.parse(reqBody)
          if (directory) {
            res.end(convert(directory));
          } else {
            res.end('Please provide me with the directory object key and its corresponding value (path) from where the files should be converted.')
          }
        } catch (error) {
          res.end('Please provide me with the directory object key and its corresponding value (path) from where the files should be converted.')
        }


      });
      break;

    case req.url == '/files' && req.method == 'GET':
      const onlyFileNames = getAllFiles().map(filpath=>path.basename(filpath))
      const all = JSON.stringify(onlyFileNames)
      res.end(all)
      break

    case req.url?.startsWith('/files/') && req.method == 'GET':
      const GETfileName = req.url?.slice(7)
      const GETavailFiles = getAllFiles()
      const GETfilePath = GETavailFiles.find(fname => path.basename(fname) == GETfileName)
      if (!GETfilePath) {
        res.end('No such file')
      } else {
        fs.readFile(GETfilePath, (err, data) => {
          if (err) {
            res.end(err.toString())
          } else {
            res.end(data.toString())
          }
        })
      }
      break

    case req.url?.startsWith('/files/') && req.method == 'DELETE':
      const DELfileName = req.url?.slice(7)
      const DELavailFiles = getAllFiles()
      const DELfilePath = DELavailFiles.find(fname => path.basename(fname) == DELfileName)
      if (!DELfilePath) {
        res.end('No such file')
      } else {
        fs.unlink(DELfilePath, (err) => {
          if (err) {
            res.end(err.toString())
          }

          res.end(`File ${DELfileName} has been deleted`);
        });
      }
      break

    default:
      res.end('Try another request')
      break;
  }


});

const port = 3001;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});