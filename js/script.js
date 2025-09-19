document.addEventListener('DOMContentLoaded', function() {
            // Definir las subespecialidades
            const subespecialidades = {
                medicina_general: ['No aplica'],
                residente: ['Medicina Familiar','Medicina Interna','Neumonologia','Oftalmologia','Otorrinolaringología','Pediatría', 'Otra'],
                oftalmologia: ['Retina', 'Córnea', 'Glaucoma', 'Oftalmología Pediátrica', 'Estrabismo','Cataratas','Cirugía refractiva','Cirugía pediátrica','Neurooftalmología','Oculoplástia','Segmento Anterior','Segmento Posterior','Retina, vitreo y uveítis','Oculoplastía lagrimal y orbita','Oncología ocular y tumores', 'Fellowship', 'Otra'],
                otorrinolaringologia: ['Alergia','Audiología','Cirugía De Cabeza Y Cuello', 'Cirugía Plástica Y Reconstructiva Facial','Laringología', 'Otología y Otoneurología', 'Otorrinolaringología Pediátrica', 'Rinología',  'Disfagia', 'Patología de Glándulas Salivales', 'Oncología de Cabeza y Cuello', 'Fellowship', 'Otra'],
                medicina_interna:['Alergología','Cardiología', 'Endocrinología','Farmacología', 'Gastroenterología','Geriatría', 'Hematología', 'Infectología', 'Intensivista', 'Medicina Crítica','Medicina Del Sueño', 'Nefrología' , 'Neumonología','Oncología', 'Reumatología', 'Fellowship', 'Otra'],
                medicina_familiar: ['Geriatría','Medicina De La Adolescencia','Medicina Paliativa y de Hospicio', 'Fellowship', 'Otra'],
                pediatria: ['Cardiología Pediátrica','Endocrinología Pediátrica','Gastroenterología Pediátrica','Hematología y Oncología Pediátrica','Neonatología', 'Neurología Pediátrica','Neumonología Pediátrica', 'Fellowship', 'Otra'],
                neumonologia: ['Neumonología intervencionista','Neumonología crítica','Neumonología infantil', 'Oncología Torácica', 'Patología Pleural', 'Enfermedades Vasculares Pulmonares', 'Fellowship', 'Otra']
            };
            
            // Obtener elementos del DOM
            const especialidadSelect = document.getElementById('especialidad');
            const subespecialidadSelect = document.getElementById('subespecialidad');
            const subespecialidadContainer = document.getElementById('subespecialidad-container');
            const residentCheckboxGroup = document.getElementById('resident-checkbox-group');
            const optionalCheckboxGroup = document.getElementById('optional-checkbox-group');
            const form = document.getElementById('myForm');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            // Ocultar los grupos de checkbox al inicio
            residentCheckboxGroup.style.display = 'none';
            optionalCheckboxGroup.style.display = 'none';
            
            // Evento cuando cambia la especialidad
            especialidadSelect.addEventListener('change', function() {
                const especialidad = this.value;
                
                // Resetear errores
                hideError('especialidadError');
                hideError('subespecialidadError');
                hideError('residentLevelError');
                
                // Manejar el campo de subespecialidad
                if (especialidad === 'medicina_general') {
                    // Ocultar subespecialidad para Medicina General
                    subespecialidadContainer.style.display = 'none';
                    subespecialidadSelect.disabled = true;
                    subespecialidadSelect.removeAttribute('required');
                } else {
                    // Mostrar y habilitar subespecialidad para otras especialidades
                    subespecialidadContainer.style.display = 'block';
                    subespecialidadSelect.disabled = false;
                    subespecialidadSelect.setAttribute('required', 'required');
                    
                    // Limpiar opciones actuales
                    subespecialidadSelect.innerHTML = '';
                    
                    // Agregar opción por defecto
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Seleccione una subespecialidad';
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    subespecialidadSelect.appendChild(defaultOption);
                    
                    // Agregar las subespecialidades correspondientes
                    if (especialidad && subespecialidades[especialidad]) {
                        subespecialidades[especialidad].forEach(function(subespecialidad) {
                            const option = document.createElement('option');
                            option.value = subespecialidad.toLowerCase().replace(/\s+/g, '-');
                            option.textContent = subespecialidad;
                            subespecialidadSelect.appendChild(option);
                        });
                    }
                }
                
                // Manejar los checkboxes de residente
                if (especialidad === 'residente') {
                    residentCheckboxGroup.style.display = 'block';
                    optionalCheckboxGroup.style.display = 'none';
                    
                    // Hacer los radio buttons obligatorios
                    document.querySelectorAll('#resident-checkbox-group .form-check-input').forEach(radio => {
                        radio.setAttribute('required', 'required');
                    });
                } else if (especialidad !== 'medicina_general') {
                    // Mostrar checkboxes opcionales para otras especialidades (excepto medicina general)
                    optionalCheckboxGroup.style.display = 'block';
                    residentCheckboxGroup.style.display = 'none';
                    
                    // Quitar el atributo required de los radio buttons opcionales
                    document.querySelectorAll('#optional-checkbox-group .form-check-input').forEach(radio => {
                        radio.removeAttribute('required');
                    });
                } else {
                    // Ocultar ambos grupos de checkboxes para medicina general
                    residentCheckboxGroup.style.display = 'none';
                    optionalCheckboxGroup.style.display = 'none';
                }
            });
            
            // Validar nombre en tiempo real
            document.getElementById('nombre').addEventListener('input', function() {
                validateNombre();
            });
            
            // Validar cédula en tiempo real
            document.getElementById('cedula').addEventListener('input', function() {
                validateCedula();
            });
            
            // Validar mpps en tiempo real
            document.getElementById('mpps').addEventListener('input', function() {
                validateMpps();
            });
            
            // Validar teléfono en tiempo real
            document.getElementById('telefono').addEventListener('input', function() {
                formatTelefono();
                validateTelefono();
            });
            
            // Validar correo en tiempo real
            document.getElementById('correo').addEventListener('input', function() {
                validateCorreo();
            });
            
            // Validar especialidad en tiempo real
            document.getElementById('especialidad').addEventListener('change', function() {
                validateEspecialidad();
            });
            
            // Validar subespecialidad en tiempo real
            document.getElementById('subespecialidad').addEventListener('change', function() {
                validateSubespecialidad();
            });
            
            // Validar nivel de residencia en tiempo real
            document.querySelectorAll('input[name="residentLevel"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    validateResidentLevel();
                });
            });
            
            // Función para mostrar error
            function showError(id) {
                document.getElementById(id).style.display = 'block';
                const inputId = id.replace('Error', '');
                if (document.getElementById(inputId)) {
                    document.getElementById(inputId).classList.add('error-input');
                }
            }
            
            // Función para ocultar error
            function hideError(id) {
                document.getElementById(id).style.display = 'none';
                const inputId = id.replace('Error', '');
                if (document.getElementById(inputId)) {
                    document.getElementById(inputId).classList.remove('error-input');
                }
            }
            
            // Función para validar nombre
            function validateNombre() {
                const nombre = document.getElementById('nombre').value.trim();
                const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                
                if (!nombre || !nombreRegex.test(nombre)) {
                    showError('nombreError');
                    return false;
                } else {
                    hideError('nombreError');
                    return true;
                }
            }
            
            // Función para validar cédula
            function validateCedula() {
                const cedula = document.getElementById('cedula').value.trim();
                
                if (!cedula || !/^\d+$/.test(cedula)) {
                    showError('cedulaError');
                    return false;
                } else {
                    hideError('cedulaError');
                    return true;
                }
            }
            
            // Función para validar mpps
            function validateMpps() {
                const mpps = document.getElementById('mpps').value.trim();
                
                if (!mpps || !/^\d+$/.test(mpps)) {
                    showError('mppsError');
                    return false;
                } else {
                    hideError('mppsError');
                    return true;
                }
            }
            
            // Función para validar teléfono
            function validateTelefono() {
                const telefono = document.getElementById('telefono').value.trim();
                const telefonoRegex = /^\(\d{4}\)-\d{3}-\d{4}$/;
                
                if (!telefono || !telefonoRegex.test(telefono)) {
                    showError('telefonoError');
                    return false;
                } else {
                    hideError('telefonoError');
                    return true;
                }
            }
            
            // Función para validar correo
            function validateCorreo() {
                const correo = document.getElementById('correo').value.trim();
                
                if (!correo || correo.indexOf('@') === -1) {
                    showError('correoError');
                    return false;
                } else {
                    hideError('correoError');
                    return true;
                }
            }
            
            // Función para validar especialidad
            function validateEspecialidad() {
                const especialidad = document.getElementById('especialidad').value;
                
                if (!especialidad) {
                    showError('especialidadError');
                    return false;
                } else {
                    hideError('especialidadError');
                    return true;
                }
            }
            
            // Función para validar subespecialidad
            function validateSubespecialidad() {
                const especialidad = document.getElementById('especialidad').value;
                const subespecialidad = document.getElementById('subespecialidad').value;
                
                // Solo validar si no es medicina_general
                if (especialidad && especialidad !== 'medicina_general' && !subespecialidad) {
                    showError('subespecialidadError');
                    return false;
                } else {
                    hideError('subespecialidadError');
                    return true;
                }
            }
            
            // Función para validar nivel de residencia
            function validateResidentLevel() {
                const especialidad = document.getElementById('especialidad').value;
                const residentLevel = document.querySelector('input[name="residentLevel"]:checked');
                
                // Solo validar si la especialidad es "residente"
                if (especialidad === 'residente' && !residentLevel) {
                    showError('residentLevelError');
                    return false;
                } else {
                    hideError('residentLevelError');
                    return true;
                }
            }
            
            // Formatear teléfono
            function formatTelefono() {
                let value = document.getElementById('telefono').value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    value = '(' + value;
                    
                    if (value.length > 5) {
                        value = value.substring(0, 5) + ')-' + value.substring(5);
                    }
                    
                    if (value.length > 10) {
                        value = value.substring(0, 10) + '-' + value.substring(10);
                    }
                    
                    // Limitar a 15 caracteres (formato completo)
                    value = value.substring(0, 15);
                }
                
                document.getElementById('telefono').value = value;
            }
            
            // Función para limpiar el formulario
            function limpiarFormulario() {
                document.getElementById('myForm').reset();
                document.getElementById('subespecialidad').innerHTML = '<option value="" selected disabled>Primero seleccione una especialidad</option>';
                document.getElementById('subespecialidad').disabled = true;
                subespecialidadContainer.style.display = 'block';
                residentCheckboxGroup.style.display = 'none';
                optionalCheckboxGroup.style.display = 'none';
                
                // Restablecer la opción "No aplica" como seleccionada
                document.getElementById('opt-na').checked = true;
                
                // Ocultar todos los errores
                document.querySelectorAll('.error').forEach(el => {
                    el.style.display = 'none';
                });
                
                // Quitar clases de error
                document.querySelectorAll('.form-control, .form-select').forEach(el => {
                    el.classList.remove('error-input');
                });
            }
            
            // Función para guardar datos en el servidor (simulado)
            function guardarEnServidor(formData) {
                return new Promise((resolve, reject) => {
                    // Simulamos una llamada al servidor
                    setTimeout(() => {
                        // En un entorno real, aquí harías una petición a tu backend
                        // que se encargaría de guardar los datos en un archivo JSON
                        console.log("Datos a guardar en el servidor:", formData);
                        
                        // Simulamos que el guardado fue exitoso
                        resolve({ exito: true, mensaje: 'Datos guardados correctamente en el servidor' });
                        
                        // En un caso real, aquí podrías:
                        // 1. Hacer una petición fetch a tu endpoint del servidor
                        // 2. El servidor guardaría los datos en un archivo JSON
                        // 3. Recibirías una respuesta de confirmación
                    }, 1000);
                });
            }
            
            // Función para guardar datos
            async function guardarDatos(formData) {
                // Obtener datos existentes o inicializar array vacío
                let datosGuardados = JSON.parse(localStorage.getItem('formularios')) || [];
                
                // Verificar si la cédula ya existe
                const cedulaExiste = datosGuardados.some(item => item.cedula === formData.cedula);
                
                if (cedulaExiste) {
                    return { exito: false, mensaje: 'Error: Ya existe un registro con esta cédula.' };
                }
                
                // Agregar timestamp
                formData.timestamp = new Date().toISOString();
                formData.id = Date.now(); // ID único basado en timestamp
                
                // Agregar nuevo dato
                datosGuardados.push(formData);
                
                // Guardar en localStorage
                try {
                    localStorage.setItem('formularios', JSON.stringify(datosGuardados));
                    
                    // Guardar en el servidor (simulado)
                    const resultadoServidor = await guardarEnServidor(formData);
                    
                    if (resultadoServidor.exito) {
                        return { exito: true, mensaje: '¡Formulario enviado correctamente! Los datos han sido guardados.' };
                    } else {
                        return { exito: false, mensaje: 'Error al guardar en el servidor: ' + resultadoServidor.mensaje };
                    }
                } catch (e) {
                    return { exito: false, mensaje: 'Error al guardar los datos: ' + e.message };
                }
            }
            
            // Manejar envío del formulario
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
                    
                    // Guardar datos
                    const resultado = await guardarDatos(formData);
                    
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
                } else {
                    // Mostrar mensaje general de error
                    errorMessage.textContent = 'Por favor, complete todos los campos requeridos correctamente.';
                    errorMessage.style.display = 'block';
                }
            });
        });