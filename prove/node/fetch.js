let lib = require('./index.js');

try 
{
    let promise = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    let json = promise.json;
    console.log(json.toString());
}
catch(err)
{
    console.error(err);
}
