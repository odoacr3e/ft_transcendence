let lib = require('./lib/lib.js');

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

async function fetchJesus(path, res, lib)
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
    let html = "<html><body><img src='" + data + "'></body></html>";
    let img = await fetch(data);
    let arrayBuffer = await img.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    res.write(html + "\nSay my name...\nJ...Jesus?!\nYou are fucking right!!\n*gun shoots*");
    await lib.fs.writeFile("." + path + ".jpg", buffer);
    res.end();
  }
  catch (error)
  {
    res.end(error.toString());
  }
}

async function getImage(path, res, lib)
{
  try
  {
    let data = await lib.fs.readFile("." + path + ".jpg");
    res.setHeader("Content-Type", "image/jpg");
    res.end(data);
  }
  catch (err)
  {
    fetchJesus(path, res, lib);
  }
}

async function startServer()
{
  const ssl = await lib.utils.sslOptions(lib);
  const srv = lib.https.createServer(ssl, (req, res) => {
  let url = lib.url.parse(req.url);

  if (url.pathname == "/")
    res.end(tutorial);
  else if (url.pathname == "/jesus/")
  {
    autoIndex(res);
  }
  else if (lib.utils.urlDir(url.pathname) == "/jesus/")
  {
    if (req.method == "GET")
      getImage(url.pathname, res, lib);
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
  srv.listen(443, "localhost");
}

startServer();