const express = require("express");
const bodyParser = require("body-parser");
//const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

var corsOptions = {
origin: "http://localhost:8089",
};
//app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const creditos = require ("./app/creditos");

app.get('/', (request, response) => {
    response.json({ info: 'Prueba técnica cencosud' })
})
app.get('/consultar', creditos.consultar);
app.post('/descontar', creditos.descontar);
app.post('/agregar', creditos.agregar);





