const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const creditos = require ("./app/creditos");

app.get('/', (request, response) => {
    response.json({ info: 'Prueba técnica cencosud' })
})
app.get('/consultar', creditos.consultar);
app.post('/descontar', creditos.descontar);
app.post('/agregar', creditos.agregar);





