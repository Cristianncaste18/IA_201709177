const express = require('express')
const app = express()
const logger = require('morgan')
const axios = require('axios');
const minimax = require('./minimax')

app.use(logger('dev'))

app.get('', async (req,res) =>{
    turno = req.query.turno
    estado = req.query.estado
    const result = await minimax(turno,estado)
    res.send(String(result))
})

app.listen(3000,()=>{ 
     console.log('Server on port 3000')
})