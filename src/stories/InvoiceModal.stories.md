# InvoiceModal Stories - Guía de Uso

## 📚 Descripción General

Las stories del `InvoiceModal` están diseñadas para mostrar todos los estados y funcionalidades posibles del componente modal para crear facturas.

## 🎯 Stories Disponibles

### 📖 Stories Básicas
- **🔧 Por defecto**: Modal abierto en estado inicial
- **❌ Modal cerrado**: Modal cerrado con controles interactivos
- **⏳ Estado de carga**: Modal mostrando spinner durante creación
- **❌ Con error**: Modal con mensaje de error

### 🎭 Stories Interactivas
- **🎮 Interactivo**: Modal con controles para abrir/cerrar
- **🐌 Red lenta**: Simula conexión lenta (3 segundos)
- **🔌 Error de red**: Simula error de conexión

### 📱 Stories Responsivas
- **📱 Vista móvil**: Optimizado para dispositivos móviles
- **📟 Vista tablet**: Layout adaptativo para tablets

### 🎨 Stories de Formulario
- **📝 Formulario prellenado**: Datos de ejemplo con vista previa
- **♿ Navegación por teclado**: Demuestra accesibilidad

### 🔧 Stories de Desarrollo
- **🔧 Modo desarrollo**: Con herramientas de debugging

## 🛠️ Características Técnicas

### Mock Store
- **Estado simulado**: Cada story puede configurar el estado del store
- **Acciones mockeadas**: Todas las acciones del store están simuladas
- **Logging**: Las acciones se registran en la consola para debugging

### Configuración Personalizable
- `storeState`: Estado del store de Zustand
- `showBackground`: Mostrar fondo contextual
- `showControls`: Mostrar controles interactivos

### Validaciones Incluidas
- **Nombre del cliente**: Requerido, 2-100 caracteres
- **Fecha**: Requerida, no puede ser futura
- **Monto**: Requerido, positivo, $0.01 - $999,999.99
- **Estado**: Requerido (Pendiente/Pagada)

## 🧪 Testing

### Casos de Prueba Cubiertos
1. **Estados del modal**: Abierto, cerrado, carga, error
2. **Validaciones**: Campos requeridos, formatos, rangos
3. **Responsividad**: Móvil, tablet, desktop
4. **Accesibilidad**: Navegación por teclado, focus
5. **Red**: Conexión lenta, errores de conexión

### Debugging
- Usa la story "🔧 Modo desarrollo" para debugging avanzado
- Revisa la consola del navegador para logs de acciones
- El panel de debug muestra estado en tiempo real

## 📝 Notas de Implementación

### Dependencias
- **CoreUI**: Estilos CSS incluidos automáticamente
- **Formik + Yup**: Validación de formularios
- **Zustand**: Manejo de estado

### Mocking
- El store original se reemplaza temporalmente
- Se restaura automáticamente al cambiar de story
- Las acciones están completamente simuladas

## 🚀 Uso Recomendado

1. **Desarrollo**: Usa las stories básicas para desarrollo
2. **Testing**: Usa stories interactivas para pruebas manuales
3. **Debugging**: Usa el modo desarrollo para investigar issues
4. **Documentación**: Todas las stories incluyen documentación completa
