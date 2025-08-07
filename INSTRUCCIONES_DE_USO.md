# 🎯 **INSTRUCCIONES DE USO - MÓDULO DE FACTURACIÓN**

## 🚀 **INICIO RÁPIDO**

### **1. Iniciando la Aplicación**
```bash
# Desde el directorio invoicing/
npm run dev

# El servidor se iniciará en:
# http://localhost:5173 (o puerto similar)
```

### **2. Accediendo a la Aplicación**
- Abre tu navegador web
- Ve a `http://localhost:5173`
- La aplicación cargará automáticamente el dashboard

---

## 📱 **NAVEGACIÓN POR DISPOSITIVO**

### **💻 Desktop (> 1024px)**
- **Vista completa**: Dashboard con 4 cards + AG Grid
- **Búsqueda global**: Barra superior derecha
- **Botones de acción**: Header superior 
- **Tabla AG Grid**: Completa con ordenamiento, paginación, filtros

### **📱 Tablet (640px - 1024px)**  
- **Vista mixta**: Cards en 2 columnas
- **Tabla híbrida**: AG Grid compacta
- **Botones medianos**: Tamaño optimizado
- **Filtros horizontales**: 2 columnas

### **📱 Móvil (< 640px)**
- **Vista vertical**: Cards apiladas  
- **Cards de facturas**: En lugar de tabla
- **Búsqueda expandible**: Debajo del título
- **Botones full-width**: Ocupan todo el ancho

---

## 🎛️ **FUNCIONALIDADES PRINCIPALES**

### **📊 Dashboard y Estadísticas**
1. **Cards superiores** muestran:
   - Total de facturas
   - Facturas pagadas (verde)
   - Facturas pendientes (amarillo)
   - Monto total (morado)

2. **Actualización automática**: Los números cambian instantáneamente al filtrar

### **🔍 Búsqueda Global**
1. **Ubicación**:
   - Desktop: Barra superior derecha
   - Móvil: Debajo del título principal

2. **Cómo usar**:
   - Escribe mínimo 2 caracteres
   - Ve resultados instantáneos
   - Haz clic en un resultado para aplicar filtro automático

3. **Búsqueda en**:
   - Número de factura (ej: "INV-2024-001")  
   - Nombre de cliente (ej: "Empresa ABC")
   - Estado (ej: "Pagada")
   - Monto (ej: "1250")

### **📋 Lista de Facturas**

#### **Vista Desktop - AG Grid**
1. **Ordenamiento**: Clic en headers de columnas
2. **Paginación**: Selector en parte inferior (10,20,50,100)
3. **Filtros por columna**: Iconos de filtro en headers
4. **Selección**: Clic en fila para seleccionar

#### **Vista Móvil - Cards**
1. **Scroll vertical**: Desliza para ver más facturas
2. **Info compacta**: Número, cliente, fecha, monto, estado
3. **Estados visuales**: Colores verde (pagada) / amarillo (pendiente)
4. **Touch-friendly**: Areas táctiles optimizadas

### **🎛️ Filtros Avanzados**
1. **Estado**: 
   - Dropdown: "Todas", "Pagada", "Pendiente"
   - Filtro inmediato al seleccionar

2. **Rango de fechas**:
   - Campo "Fecha Desde": Selecciona fecha inicial  
   - Campo "Fecha Hasta": Selecciona fecha final
   - Uso de date picker nativo

3. **Cliente**:
   - Campo de texto libre
   - Búsqueda parcial (ej: "ABC" encuentra "Empresa ABC S.A.")

4. **Limpiar filtros**:
   - Botón "Limpiar Filtros" resetea todo
   - Chips visuales muestran filtros activos

### **➕ Nueva Factura**
1. **Abrir modal**: Botón "Nueva Factura" (azul, header superior)

2. **Llenar formulario**:
   - **Cliente**: Nombre completo (obligatorio, 2-100 chars)
   - **Fecha**: Selector de fecha (no puede ser futura)  
   - **Monto**: Número decimal positivo (ej: 1250.50)
   - **Estado**: Dropdown "Pendiente" o "Pagada"

3. **Vista previa**: Panel azul muestra datos mientras escribes

4. **Validación en tiempo real**:
   - Campos requeridos marcados con *
   - Errores aparecen debajo de cada campo
   - Botón "Crear" se habilita solo si todo es válido

5. **Guardar**: 
   - Clic "Crear Factura"
   - Loading spinner durante guardado  
   - Notificación de éxito
   - Factura aparece automáticamente en lista

### **📤 Exportar CSV**
1. **Botón "Exportar"**: Header superior
2. **Proceso**:
   - Toma facturas actualmente filtradas
   - Genera CSV con headers en español  
   - Descarga automática
   - Notificación de confirmación

3. **Archivo generado**:
   - Nombre: `facturas_2024-01-15.csv`
   - Formato: Compatible Excel
   - Encoding: UTF-8

### **📥 Importar CSV**  
1. **Botón "Importar CSV"**: Header superior
2. **Proceso**:
   - Abre selector de archivos
   - Solo acepta archivos .csv
   - Validación básica de formato
   - Notificación de resultado

---

## 🔔 **SISTEMA DE NOTIFICACIONES**

### **Tipos de Notificaciones**
- ✅ **Éxito (Verde)**: "Factura INV-2024-009 creada exitosamente!"
- ❌ **Error (Rojo)**: "Error al exportar el archivo CSV"  
- ⚠️ **Warning (Amarillo)**: "El archivo CSV está vacío"
- ℹ️ **Info (Azul)**: Información general

### **Ubicación**: 
- **Posición**: Esquina superior derecha
- **Auto-dismiss**: 3 segundos (éxito/info), 5 segundos (warning)
- **Manual**: Botón X siempre disponible
- **Stack**: Múltiples notificaciones se apilan

---

## 🎯 **CASOS DE USO TÍPICOS**

### **👤 Caso 1: Consultar Estado de Cobros**
1. Abre aplicación → Ve dashboard con estadísticas
2. Observa: 4 pagadas, 4 pendientes de 8 total  
3. Filtra por "Estado: Pendiente"
4. Ve lista de facturas por cobrar
5. Exporta CSV para seguimiento

### **👤 Caso 2: Buscar Factura Específica**
1. Usa búsqueda global: "INV-2024-003"
2. Ve resultado instantáneo en dropdown
3. Clic en resultado → Se aplica filtro automático
4. Ve factura aislada en tabla/cards

### **👤 Caso 3: Crear Nueva Factura**
1. Clic "Nueva Factura" 
2. Llena formulario:
   - Cliente: "Servicios XYZ Ltda."
   - Fecha: 2024-01-30
   - Monto: 850.75
   - Estado: Pendiente
3. Ve vista previa actualizada
4. Clic "Crear Factura"
5. Ve notificación de éxito
6. Factura aparece en lista automáticamente

### **👤 Caso 4: Análisis por Período** 
1. Filtra por rango de fechas: 
   - Desde: 2024-01-01
   - Hasta: 2024-01-31  
2. Ve facturas del mes
3. Observa estadísticas actualizadas
4. Exporta reporte mensual en CSV

### **👤 Caso 5: Seguimiento por Cliente**
1. Busca en filtro Cliente: "Empresa ABC"
2. Ve todas las facturas del cliente
3. Analiza estado de pagos 
4. Identifica patrones de pago

---

## 🛠️ **SOLUCIÓN DE PROBLEMAS**

### **❌ La aplicación no carga**
```bash
# Verificar que el servidor esté corriendo
npm run dev

# Si el puerto está ocupado, Vite elegirá otro:
# Port 5173 is in use, trying another one...
# VITE ready in 429 ms
# ➜  Local:   http://localhost:5174/
```

### **❌ No veo las facturas**
1. Verifica que las cards de estadísticas muestren números > 0
2. Revisa si hay filtros activos (chips azules)
3. Usa "Limpiar Filtros" para resetear
4. Prueba la búsqueda global con "INV-2024"

### **❌ Los filtros no funcionan**
1. Asegúrate de que hay datos para filtrar
2. Verifica formato de fechas (YYYY-MM-DD)
3. Prueba limpiar filtros y aplicar uno por vez
4. Revisa la consola del navegador (F12) por errores

### **❌ El modal no se abre**
1. Verifica botón "Nueva Factura" esté visible
2. Revisa si hay errores JavaScript (F12 → Console)  
3. Recarga la página (Ctrl+R)

### **❌ Responsividad no funciona**
1. Redimensiona ventana del navegador
2. En móvil: rota dispositivo para probar
3. Verifica que TailwindCSS se esté cargando
4. Usa herramientas desarrollador (F12) para simular dispositivos

---

## 📊 **DATOS DE PRUEBA INCLUIDOS**

### **8 Facturas Mock**
```
INV-2024-001 - Empresa ABC S.A.        - $1,250.50 - Pagada
INV-2024-002 - Comercial XYZ Ltda.     - $2,890.00 - Pendiente  
INV-2024-003 - Servicios DEF Corp.     - $750.25   - Pagada
INV-2024-004 - Industrias GHI S.A.S.   - $4,200.00 - Pendiente
INV-2024-005 - Distribuciones JKL      - $1,800.75 - Pagada
INV-2024-006 - Consultores MNO         - $950.00   - Pendiente  
INV-2024-007 - Tecnología PQR          - $3,500.25 - Pagada
INV-2024-008 - Logística STU           - $2,150.00 - Pendiente
```

### **Estadísticas Esperadas**
- **Total**: 8 facturas
- **Pagadas**: 4 facturas ($7,301.75)  
- **Pendientes**: 4 facturas ($10,190.00)
- **Monto Total**: $17,491.75

---

## 🎉 **¡DISFRUTA USANDO EL MÓDULO DE FACTURACIÓN!**

*Desarrollado con React 19, TailwindCSS v4, CoreUI, AG Grid, Zustand*  
*✅ Responsive | ✅ Funcional | ✅ Profesional*