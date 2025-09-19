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
