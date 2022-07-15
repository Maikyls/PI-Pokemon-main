var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fetch = require('cross-fetch');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());


app.get(`/test`, function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    fetch('https://pokeapi.co/api/v2/pokemon')
    .then(result=>result.json())
    .then(json=>{
        res.send(json);
    }).catch(err=>{
        console.error("ocurrio un error muy gay",err);
        res.send("usuario esto fallo");
    });
});

app.listen(8081);