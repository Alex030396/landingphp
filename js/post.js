function guardarEnServidor(formData) {
    return fetch('/guardar-formulario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
        return { exito: false, mensaje: 'Error de conexión con el servidor' };
    });
}