let  lib = require("./lib/lib.js");


let srv;
try
{
    let ssl = lib.utils.sslOptions();
    srv = lib.https.createServer(ssl, lib.app);
    srv.listen(8443, () => {console.log("ehm...fotto...anch'io...see...");});
}
catch (err)
{
    console.log(err);
    console.log("e sei pure frocio");
}
let io = new lib.Server(srv);

lib.app.get('/', (req, res) => {
    res.send("ti fotto io\n");
})

io.on('connect', (socket) => {
    console.log("uno stronzo tenta di fotterci", socket.id);
    socket.on('p', (msg) => {
        console.log(msg);
    })
    socket.on('disconnect', () => {
        console.log("hanno smesso di foterci", socket.id);
    })
    socket.emit('a', 'aaaaaaaaaaa', (err, response) => {
        if (err)
            console.log(err);
        else if (response)
            console.log(response);
        else
            console.log("boh");
    });
})OCTYPE html>
<html>
<head>
  <title>Simple Chat</title>
  <style>
  body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  #messages {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    padding: 10px;
    height: 400px;
    overflow-y: auto;
    }
    #messages li {
      padding: 8px 16px;
      border-bottom: 1px solid #eee;
    }
    #messages li:last-child {
      border-bottom: none;
    }
    #form {
      display: flex;
      margin-top: 10px;
    }
    #input {
      flex-grow: 1;
      padding: 10px;
      font-size: 16px;
    }
