let lib = require('./lib.js');

/*
  crei server

*/

let tutorial = "loc:\n\
  /       -->   help\n\
  /jesus/ -->   autoIndex di tutte le immagini\n\
  /jejus/filename ->\n\
                GET: 1. check se immagine c'e su ./jesus/\n\
                2.  altrimenti la fetcha dall'API \n\
                3. torna 404  \n\
                POST: salva l'immagine mandata, se valida, altrimenti 400\n\
  /fight/character_name -->\n\
                GET: chiediamo a openAi di simulare scontro";

async function autoIndex(res)
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

function urlDir(url)
{
  let noJ = url.substring(0, url.lastIndexOf("/") + 1);
  return noJ;
}

function urlArg(url)
{
  let noJ = url.substring(url.lastIndexOf("/") + 1, url.length);
  return noJ;
}

async function fetchJesus(res)
{
  try
  {
    let response = await fetch("https://api.unsplash.com/photos/random?query=jesus", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Client-ID zloeZznzclhomXsSB1JpIzkwAE5o2wZPyU_LxJKSUfM'
      }
    });
    if (!response.ok)
      throw (await response.status);
    let data = await response.json();
    data = data.urls.small;
    // let img = await fetch(data);
    // if (!img.ok)
    //   throw (await img.status);
    let html = "<html><body><img src='" + data + "'></body></html>";

    res.end(html + "\nSay my name...\nJ...Jesus?!\nYou are fucking right!!\n*gun shoots*");
  }
  catch (error)
  {
    res.end(error.toString());
  }
}

async function getImage(path, res)
{
  try
  {
    let file = await lib.fs.open("." + path);
    file.close();
    file.close();
  }
  catch (err)
  {
    fetchJesus(res);
  }
}

const srv = lib.http.createServer((req, res) => {
let url = lib.url.parse(req.url);

if (url.pathname == "/")
  res.end(tutorial);
else if (url.pathname == "/jesus/")
{
  autoIndex(res);
}
else if (urlDir(url.pathname) == "/jesus/")
{
  if (req.method == "GET")
    getImage(url.pathname, res);
  else
  {
    res.statusCode = 405;
    res.end("You are done...Fired!\n");
  }
}
else
{
  res.statusCode = 404;
  res.end("Wrong location bitch!\n");
}
});

srv.listen(8080, "localhost");