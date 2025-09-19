// Función para guardar datos (Para cambiar de método)
    function guardarDatos(formData) {
        // Obtener datos existentes o inicializar array vacío
        let datosGuardados = JSON.parse(localStorage.getItem('formularios')) || [];
        
        // Verificar si la cédula ya existe
        const cedulaExiste = datosGuardados.some(item => item.cedula === formData.cedula);
        
        if (cedulaExiste) {
            return { exito: false, mensaje: 'Error: Ya existe un registro con esta cédula.' };
        }
        
        // Agregar timestamp
        formData.timestamp = new Date().toISOString();
        
        // Agregar nuevo dato
        datosGuardados.push(formData);
        
        // Guardar en localStorage (puedes cambiar por una petición a un servidor)
        try {
            localStorage.setItem('formularios', JSON.stringify(datosGuardados));
            return { exito: true, mensaje: '¡Formulario enviado correctamente! Los datos han sido guardados.' };
        } catch (e) {
            return { exito: false, mensaje: 'Error al guardar los datos: ' + e.message };
        }
    }
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Ocultar mensajes previos
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Validar todos los campos
        const isNombreValid = validateNombre();
        const isCedulaValid = validateCedula();
        const isMppsValid = validateMpps();
        const isTelefonoValid = validateTelefono();
        const isCorreoValid = validateCorreo();
        const isEspecialidadValid = validateEspecialidad();
        const isSubespecialidadValid = validateSubespecialidad();
        const isResidentLevelValid = validateResidentLevel();
        
        // Obtener valores
        const nombre = document.getElementById('nombre').value.trim();
        const cedula = document.getElementById('cedula').value.trim();
        const mpps = document.getElementById('mpps').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const especialidad = document.getElementById('especialidad').value;
        const subespecialidad = document.getElementById('subespecialidad').value;
        const lugarVive = document.getElementById('lugarVive').value.trim();
        
        // Obtener nivel de residencia seleccionado
        let nivelResidencia = '';
        if (especialidad === 'residente') {
            const selectedResidentLevel = document.querySelector('input[name="residentLevel"]:checked');
            nivelResidencia = selectedResidentLevel ? selectedResidentLevel.value : '';
        } else if (especialidad !== 'medicina_general') {
            const selectedOptionalLevel = document.querySelector('input[name="optionalResidentLevel"]:checked');
            nivelResidencia = selectedOptionalLevel ? selectedOptionalLevel.value : 'No aplica';
        } else {
            nivelResidencia = 'Graduado';
        }
        
        // Determinar el valor de subespecialidad
        let subespecialidadValor = '';
        if (especialidad === 'medicina_general') {
            subespecialidadValor = 'No aplica';
        } else {
            subespecialidadValor = subespecialidad;
        }
        
        // Si es válido, crear JSON y mostrar
        if (isNombreValid && isCedulaValid && isMppsValid && isTelefonoValid && isCorreoValid && 
            isEspecialidadValid && isSubespecialidadValid && isResidentLevelValid) {
            
            const formData = {
                nombre: nombre,
                cedula: cedula,
                mpps: mpps,
                telefono: telefono,
                correo: correo,
                especialidad: especialidad,
                subespecialidad: subespecialidadValor,
                nivelResidencia: nivelResidencia,
                direccion: lugarVive
            };
            
            const jsonData = JSON.stringify(formData, null, 2);
           
            
            // Guardar datos
            const resultado = guardarDatos(formData);
            
            if (resultado.exito) {
                successMessage.textContent = resultado.mensaje;
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                
                // Limpiar formulario después de 2 segundos
                setTimeout(limpiarFormulario, 2000);
            } else {
                errorMessage.textContent = resultado.mensaje;
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
            }
            
            // Desplazarse hacia el resultado
            document.getElementById('jsonOutput').scrollIntoView({ behavior: 'smooth' });
        } else {
            // Mostrar mensaje general de error
            errorMessage.textContent = 'Por favor, complete todos los campos requeridos correctamente.';
            errorMessage.style.display = 'block';
        }
    });