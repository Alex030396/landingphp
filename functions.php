<?php
// Función para cargar estilos y scripts
function oftalmi_theme_scripts() {
    // Cargar Bootstrap CSS
    wp_enqueue_style('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
    
    // Cargar Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    
    // Cargar estilos del tema
    wp_enqueue_style('oftalmi-style', get_stylesheet_uri());
    
    // Cargar Bootstrap JS
    wp_enqueue_script('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js', array('jquery'), '', true);
    
    // Cargar scripts personalizados
    wp_enqueue_script('oftalmi-script', get_template_directory_uri() . '/js/script.js', array('jquery'), '', true);
}
add_action('wp_enqueue_scripts', 'oftalmi_theme_scripts');
?>
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

// Pasar variables AJAX a JavaScript
function oftalmi_ajax_vars() {
    ?>
    <script type="text/javascript">
        var oftalmi_ajax = {
            ajax_url: '<?php echo admin_url('admin-ajax.php'); ?>'
        };
    </script>
    <?php
}
add_action('wp_head', 'oftalmi_ajax_vars');