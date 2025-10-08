<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// FUNCIÓN PARA VERIFICAR DUPLICADOS (CÉDULA + EVENTO)
function verificarDuplicado($cedula, $evento) {
    $archivo = 'registros.csv';
    
    // Si el archivo no existe, no hay duplicados
    if (!file_exists($archivo)) {
        return false;
    }
    
    // Leer el archivo línea por línea
    $lineas = file($archivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    // Saltar la primera línea (encabezados)
    array_shift($lineas);
    
    foreach ($lineas as $linea) {
        // Parsear la línea CSV
        $campos = str_getcsv($linea);
        
        // Verificar que tenga al menos 10 campos (cedula está en índice 1, evento en índice 9)
        if (count($campos) >= 10) {
            $cedulaExistente = trim($campos[1], '" ');
            $eventoExistente = trim($campos[9], '" ');
            
            // Comparar cédula y evento (ambos deben coincidir)
            if ($cedulaExistente === $cedula && $eventoExistente === $evento) {
                return true; // Encontró un duplicado
            }
        }
    }
    
    return false; // No hay duplicados
}

// Función alternativa más simple
function guardarEnGoogleSheetsSimple($datos) {
    $archivo = 'registros.csv';
    
    // Si el archivo no existe, crear encabezados
    if (!file_exists($archivo)) {
        $encabezados = "Nombre,Cédula,MPPS,Teléfono,Correo,Especialidad,Subespecialidad,Nivel Residencia,Dirección,Evento,Fecha\n";
        file_put_contents($archivo, $encabezados);
    }
    
    // Preparar línea CSV
    $linea = [
        '"' . str_replace('"', '""', $datos['nombre'] ?? '') . '"',
        '"' . str_replace('"', '""', $datos['cedula'] ?? '') . '"',
        '"' . str_replace('"', '""', $datos['mpps'] ?? '') . '"',
        '"' . str_replace('"', '""', $datos['telefono'] ?? '') . '"',
        '"' . str_replace('"', '""', $datos['correo'] ?? '') . '"',
        '"' . str_replace('"', '""', $datos['especialidad'] ?? '') . '"',
        '"' . str_replace('"', '""', $datos['subespecialidad'] ?? '') . '"',
        '"' . str_replace('"', '""', $datos['nivelResidencia'] ?? '') . '"',
        '"' . str_replace('"', '""', $datos['direccion'] ?? '') . '"',
        '"' . str_replace('"', '""', $datos['evento'] ?? '') . '"',
        '"' . date('Y-m-d H:i:s') . '"'
    ];
    
    file_put_contents($archivo, implode(',', $linea) . "\n", FILE_APPEND | LOCK_EX);
    
    return [
        'exito' => true,
        'mensaje' => '¡Registro exitoso! Los datos se han guardado localmente.'
    ];
}

// Procesar request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $jsonInput = file_get_contents('php://input');
        
        if (empty($jsonInput)) {
            throw new Exception('No se recibieron datos');
        }
        
        $data = json_decode($jsonInput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('JSON inválido');
        }
        
        // Validar campos
        $required_fields = ['nombre', 'cedula', 'mpps', 'telefono', 'correo', 'especialidad', 'subespecialidad', 'nivelResidencia', 'direccion','evento'];
        $missing_fields = [];
        
        foreach ($required_fields as $field) {
            if (empty($data[$field])) {
                $missing_fields[] = $field;
            }
        }
        
        if (!empty($missing_fields)) {
            throw new Exception('Faltan campos: ' . implode(', ', $missing_fields));
        }
        
        // VERIFICAR DUPLICADO ANTES DE GUARDAR
        $cedula = $data['cedula'];
        $evento = $data['evento'];
        
        if (verificarDuplicado($cedula, $evento)) {
            echo json_encode([
                'exito' => false,
                'mensaje' => 'Error: Ya existe un registro con la cédula ' . $cedula . ' para el evento ' . $evento
            ]);
            exit;
        }
        
        // Si no hay duplicado, guardar el registro
        $resultado = guardarEnGoogleSheetsSimple($data);
        echo json_encode($resultado);
        
    } catch (Exception $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Método no permitido'
    ]);
}
?>