------------------
oftalmi-landing/
├── style.css
├── functions.php
├── header.php
├── footer.php
├── index.php
├── template-oftalmi-landing.php
├── js/
│   └── script.js
└── img/
    ├── landing.gif
    ├── TITULO.gif
    └── PORTADA.jpg

------------------
Archivos necesarios para tu tema de WordPress
1. Archivo style.css
2. Archivo functions.php
3. Archivo header.php
4. Archivo footer.php
5. Archivo template-oftalmi-landing.php
6. Archivo js/script.js
7. Archivo index.php

------------------
Pasos para implementar en WordPress
 1. Crea la carpeta oftalmi-landing con todos los archivos mencionados

 2. Sube las imágenes a la carpeta img/

 3. Comprime la carpeta en un archivo ZIP

 4. En tu WordPress, ve a Apariencia > Temas > Añadir nuevo > Subir tema

 5. Sube el archivo ZIP y activa el tema

 6. Crea una nueva página en WordPress

 7. En "Atributos de página", selecciona la plantilla "Landing Oftalmi"

 8. Publica la página

------------------
 La función get_header()
La función get_header() de WordPress es una plantilla de etiqueta (template tag) que se usa en los archivos de los temas. 
Su propósito es incluir el archivo de plantilla del header (la cabecera) en el lugar donde se llama. Por defecto, 
esta función busca un archivo llamado header.php dentro del directorio de tu tema.

------------------
Las funciones get_header() y get_footer() están diseñadas para ser simples y, 
por defecto, buscan los archivos header.php y footer.php en el directorio de tu tema de WordPress.

------------------
En lugar de simplemente enlazar un archivo CSS en tu código HTML, usar wp_enqueue_style() permite a WordPress 
gestionar de forma inteligente cómo y cuándo se carga el CSS. Esto previene varios problemas comunes:

 1. Evita duplicaciones: Si varios plugins o el tema intentan cargar el mismo archivo CSS, WordPress lo detecta 
y lo carga solo una vez, lo que mejora la velocidad de carga de tu sitio.

 2. Gestiona dependencias: Puedes especificar que una hoja de estilo depende de otra para cargar en el orden correcto. 
Por ejemplo, si tu archivo CSS principal necesita cargar después de Bootstrap, puedes decírselo a WordPress.

 3. Mantiene el orden: WordPress se encarga de que las hojas de estilo de los plugins y del tema se carguen en el  
orden adecuado para evitar conflictos.
------------------
Codigo agregado para guardar los datos en php

<?php
// Función para procesar el formulario
function procesar_formulario_oftalmi() {
    // Verificar nonce para seguridad
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'oftalmi_form_nonce')) {
        wp_send_json_error('Error de seguridad');
        return;
    }
    
    // Recibir y sanitizar datos
    $nombre = sanitize_text_field($_POST['nombre']);
    $cedula = sanitize_text_field($_POST['cedula']);
    $mpps = sanitize_text_field($_POST['mpps']);
    $telefono = sanitize_text_field($_POST['telefono']);
    $correo = sanitize_email($_POST['correo']);
    $especialidad = sanitize_text_field($_POST['especialidad']);
    $subespecialidad = sanitize_text_field($_POST['subespecialidad']);
    $nivel_residencia = sanitize_text_field($_POST['nivel_residencia']);
    $direccion = sanitize_text_field($_POST['direccion']);
    
    // Validar campos obligatorios
    if (empty($nombre) || empty($cedula) || empty($mpps) || empty($telefono) || empty($correo) || empty($especialidad) || empty($direccion)) {
        wp_send_json_error('Todos los campos obligatorios deben ser completados');
        return;
    }
    
    // Verificar si la cédula ya existe
    if (cedula_existe($cedula)) {
        wp_send_json_error('Ya existe un registro con esta cédula');
        return;
    }
    
    // Preparar datos para guardar
    $form_data = array(
        'nombre' => $nombre,
        'cedula' => $cedula,
        'mpps' => $mpps,
        'telefono' => $telefono,
        'correo' => $correo,
        'especialidad' => $especialidad,
        'subespecialidad' => $subespecialidad,
        'nivel_residencia' => $nivel_residencia,
        'direccion' => $direccion,
        'fecha_registro' => current_time('mysql')
    );
    
    // Guardar en base de datos
    $resultado = guardar_formulario_db($form_data);
    
    if ($resultado) {
        // Opcional: Enviar email de notificación
        enviar_email_notificacion($form_data);
        
        wp_send_json_success('¡Formulario enviado correctamente! Los datos han sido guardados.');
    } else {
        wp_send_json_error('Error al guardar los datos en la base de datos');
    }
}

// Función para verificar si cédula ya existe
function cedula_existe($cedula) {
    global $wpdb;
    $tabla = $wpdb->prefix . 'oftalmi_formularios';
    
    $existe = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $tabla WHERE cedula = %s", 
        $cedula
    ));
    
    return $existe > 0;
}

// Función para guardar en base de datos
function guardar_formulario_db($datos) {
    global $wpdb;
    $tabla = $wpdb->prefix . 'oftalmi_formularios';
    
    return $wpdb->insert($tabla, $datos);
}

// Función para enviar email de notificación
function enviar_email_notificacion($datos) {
    $admin_email = get_option('admin_email');
    $asunto = 'Nuevo registro en formulario Oftalmi';
    
    $mensaje = "Se ha recibido un nuevo registro:\n\n";
    foreach ($datos as $key => $value) {
        $mensaje .= ucfirst($key) . ": " . $value . "\n";
    }
    
    wp_mail($admin_email, $asunto, $mensaje);
}

// Crear tabla personalizada en la base de datos al activar el tema
function crear_tabla_formularios() {
    global $wpdb;
    $tabla = $wpdb->prefix . 'oftalmi_formularios';
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $tabla (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        nombre varchar(100) NOT NULL,
        cedula varchar(20) NOT NULL,
        mpps varchar(20) NOT NULL,
        telefono varchar(20) NOT NULL,
        correo varchar(100) NOT NULL,
        especialidad varchar(50) NOT NULL,
        subespecialidad varchar(50) DEFAULT '',
        nivel_residencia varchar(20) DEFAULT '',
        direccion text NOT NULL,
        fecha_registro datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY cedula (cedula)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'crear_tabla_formularios');

// Registrar AJAX para usuarios logueados y no logueados
add_action('wp_ajax_procesar_formulario_oftalmi', 'procesar_formulario_oftalmi');
add_action('wp_ajax_nopriv_procesar_formulario_oftalmi', 'procesar_formulario_oftalmi');

// Agregar nonce para usar en el formulario
function agregar_nonce_formulario() {
    wp_nonce_field('oftalmi_form_nonce', 'oftalmi_nonce');
}
add_action('wp_footer', 'agregar_nonce_formulario');
?>
