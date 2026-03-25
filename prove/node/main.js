let index = require('./index.js');

/*
  loc:
  /       -->   help
  /jesus/ -->   autoindex di tutte le immagini
  /jejus/filename -> 
                GET: 1. check se immagine c'e su ./jesus/
                    2.  altrimenti la fetcha dall'API
                    3. torna 404 
                POST: salva l'immagine mandata, se valida, altrimenti 400 
*/

const srv = index.http.createServer((req, res) => {
  req.headers
});