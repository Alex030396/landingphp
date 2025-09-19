const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

app.post('/guardar-formulario', (req, res) => {
    const datos = req.body;
    
    // Leer archivo existente
    const archivo = path.join(__dirname, 'datos.json');
    let datosExistentes = [];
    
    try {
        datosExistentes = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    } catch (e) {
        // Si el archivo no existe, se creará uno nuevo
    }
    
    // Verificar si la cédula ya existe
    if (datosExistentes.some(item => item.cedula === datos.cedula)) {
        return res.status(400).json({ error: 'Ya existe un registro con esta cédula' });
    }
    
    // Agregar timestamp
    datos.timestamp = new Date().toISOString();
    datos.id = Date.now();
    
    // Agregar nuevo dato
    datosExistentes.push(datos);
    
    // Guardar en archivo
    fs.writeFileSync(archivo, JSON.stringify(datosExistentes, null, 2));
    
    res.json({ exito: true, mensaje: 'Datos guardados correctamente' });
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en puerto 3000');
});