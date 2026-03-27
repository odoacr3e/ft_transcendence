let lib = require('./lib.js');

/*
  crei server

*/

let tutorial = "loc:\n\
  /       -->   help\n\
  /jesus/ -->   autolib di tutte le immagini \n\
  /jejus/filename ->\n\
                GET: 1. check se immagine c'e su ./jesus/\n\
                2.  altrimenti la fetcha dall'API \n\
                3. torna 404  \n\
                POST: salva l'immagine mandata, se valida, altrimenti 400\n";

async function autolib(res)
{
  try
  {
    let dir = await lib.fs.opendir("./jesus/");
    let files = new Array;
    for await (let file of dir)
    {
      files.push(file.name);
    }
    res.end(files.flat() + "\n");
  }
  catch (error)
  {
    res.statusCode = 500;
    res.end("Jesse...Where are u goig Jesse?!\n");
  }
}

const srv = lib.http.createServer((req, res) => {
let url = lib.url.parse(req.url);
if (url.pathname == "/")
  res.end(tutorial);
else if (url.pathname == "/jesus/")
{
  autolib(res);
}
else
{
  res.statusCode = 404;
  res.end("Wrong location bitch!\n");
}
});

srv.listen(8080, "localhost");