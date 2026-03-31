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

module.exports = {urlDir, urlArg};