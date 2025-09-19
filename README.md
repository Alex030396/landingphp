------------------
# Estructura de la Pagina

oftalmi-landing/

├── style.css

├── functions.php

├── header.php

├── footer.php

├── index.php

├── template-oftalmi-landing.php

├── js/

│   └── script.js

│   └── node.js

│   └── post.js

└── img/

    ├── landing.gif
    
    ├── TITULO.gif
    
    └── PORTADA.jpg

------------------
He creado una función que simula el envío de datos a un servidor. En un entorno real, necesitarías implementar un backend con PHP, Node.js, etc.

Cómo implementar el guardado real en el servidor
Para guardar realmente los datos en un archivo JSON en el servidor, necesitarías:

1. Crear un backend simple con Node.js, PHP, Python, etc.

2. Implementar un endpoint que reciba los datos por POST

3. Guardar los datos en un archivo JSON en el servidor

Modificación en el código JavaScript del frontend:

Reemplaza la función **guardarEnServidor** con:
```
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
```
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
```

```
