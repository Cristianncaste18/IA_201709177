const express = require('express')
const app = express()
const logger = require('morgan')
const axios = require('axios');

app.use(logger('dev'))
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended: '10mb'}))

app.get('', async (req,res) =>{
    console.log('Llega GET')
    turno = req.query.turno
    estado = req.query.estado
    console.log('turno:',turno)
    console.log('estado',estado)
    res.send(String(25))
})

app.listen(3000,()=>{ 
     console.log('Server on port 3000')
})