/** @type {import('express').Express} */
let  lib = require("./lib/lib.js");

lib.app.

try
{
    let ssl = lib.utils.sslOptions();
    let srv = lib.https.createServer(ssl, lib.app);
    srv.listen(8443, () => {console.log("ehm...fotto...anch'io...see...");});
}
catch (err)
{
    console.log(err);
    console.log("e sei pure frocio");
}