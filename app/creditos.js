const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    //host: 'localhost',
    host: 'database-2.chqrt8xumqyz.us-east-2.rds.amazonaws.com',
    database: 'creditos',
    password: 'prueba1234',
    //password: '12345678',
    port: 5432,
})

const validaJson = (correo, monto, tienda) => {
    if ((isNaN(monto) || (!correo) || (!tienda)))
        return false

    return true;
}

const agregar = (request, response) => {
    const correo = request.body.correo;
    const monto = request.body.monto;
    const tienda = request.body.tienda;
    if (!validaJson(correo, monto, tienda))
        return response.status(400).json({
            status: 'error',
            error: 'Bad request'
        });

    pool.query("INSERT INTO public.creditos (monto, tienda, correo) VALUES ($1, $2, $3)", [monto, tienda, correo], (error, result) => {
        if (error)
            return response.status(409).json({ status: 'conflict', error: error.detail });

        response.status(200).send('credito  agregado');
    });
}

const descontar = (request, response) => {

    const correo = request.body.correo;
    const monto = request.body.monto;
    const tienda = request.body.tienda;

    if (!validaJson(correo, monto, tienda))
        return response.status(400).json({
            status: 'error',
            error: 'Bad request'
        });

    pool.query(
        "update  creditos  set monto=$2+cliente.montoactual from " +
        "(SELECT  monto AS montoactual FROM creditos WHERE correo=$1 and tienda=$3) as cliente " +
        "where correo=$1 and tienda=$3", [correo, monto, tienda], (error, results) => {
            if (error) 
                return response.status(500).json({ status: 'error', error: error.detail });
            
            response.status(200).send('credito  actualizado');
        }
    )
}

const consultar = (request, response) => {

    const correo = request.query.correo;
    const tienda = request.query.tienda;

    var query = "";
    if ((tienda) && (correo)) {
        query = "SELECT monto FROM creditos where correo='" + correo + "' and tienda='" + tienda + "' ORDER BY correo asc";
    }
    else if (tienda) {
        query = "SELECT monto, correo FROM creditos where tienda='" + tienda + "' ORDER BY correo asc";
    }
    else if (correo)
        query = "SELECT monto, tienda FROM creditos where correo='" + correo + "' ORDER BY correo asc";
    else {
        query = "SELECT * FROM creditos ORDER BY correo asc";
    }

    pool.query(query, (error, results) => {
        if (error) 
            return response.status(500).json({ status: 'error', error: error.detail });
        
        response.status(200).json(results.rows);
    });
}

module.exports = {
    consultar,
    descontar,
    agregar
}
