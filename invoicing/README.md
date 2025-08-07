# Módulo de Facturación - CustomsCity

Este es un módulo de facturación desarrollado para el Departamento de Contabilidad de CustomsCity. La aplicación permite gestionar facturas con funcionalidades de visualización, filtrado y creación.

## 🚀 Características

### ✅ Funcionalidades Implementadas

- **Tabla de Facturas con AG Grid**: Visualización moderna y eficiente de facturas
- **Filtrado Avanzado**: Por estado, rango de fechas y nombre de cliente
- **Formulario de Nueva Factura**: Con validación completa usando Formik + Yup
- **Gestión de Estado con Zustand**: Estado global reactivo y eficiente
- **Diseño Moderno**: UI consistente con CoreUI Pro y TailwindCSS
- **Estadísticas en Tiempo Real**: Dashboard con métricas clave
- **Datos Mock**: Conjunto de facturas de prueba

### 🛠️ Stack Tecnológico

- **React 19** - Framework frontend
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework de estilos utilitarios
- **CoreUI React** - Sistema de componentes UI
- **Zustand** - Gestión de estado global
- **AG Grid** - Tabla de datos avanzada
- **Formik + Yup** - Manejo y validación de formularios
- **date-fns** - Utilidades de fecha

## 📦 Instalación y Configuración

### Prerequisitos

- Node.js 16+ 
- npm o yarn

### Pasos de instalación

1. **Clonar o navegar al directorio del proyecto**
   ```bash
   cd frontend/invoicing
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🎨 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── InvoiceDashboard.jsx    # Dashboard principal
│   ├── InvoiceTable.jsx        # Tabla con AG Grid
│   ├── InvoiceFilters.jsx      # Componente de filtros
│   └── InvoiceModal.jsx        # Modal de nueva factura
├── stores/              # Gestión de estado (Zustand)
│   └── invoiceStore.js         # Store principal
├── types/               # Tipos y validaciones
│   └── invoice.js              # Tipos de factura
├── data/                # Datos mock
│   └── mockInvoices.js         # Facturas de prueba
└── utils/               # Utilidades
```

## 📋 Funcionalidades Detalladas

### 1. Tabla de Facturas (AG Grid)
- **Columnas**: Número, Cliente, Fecha, Estado, Monto
- **Ordenamiento**: Por cualquier columna
- **Paginación**: 10, 20, 50, 100 elementos por página
- **Búsqueda**: Filtros integrados en AG Grid
- **Selección**: Fila simple
- **Responsive**: Adaptable a diferentes pantallas

### 2. Filtros Avanzados
- **Estado**: Pagada, Pendiente, Todas
- **Rango de fechas**: Desde/Hasta con date picker
- **Cliente**: Búsqueda por texto
- **Filtros activos**: Visualización de filtros aplicados
- **Limpiar**: Botón para resetear todos los filtros

### 3. Formulario de Nueva Factura
- **Validación completa** con Yup:
  - Cliente: Obligatorio, 2-100 caracteres
  - Fecha: Obligatoria, no puede ser futura
  - Monto: Obligatorio, número positivo > 0
  - Estado: Pagada o Pendiente
- **Vista previa**: Muestra datos antes de guardar
- **UX/UI**: Indicadores visuales de validación
- **Generación automática**: Número de factura secuencial

### 4. Dashboard y Estadísticas
- **Métricas en tiempo real**:
  - Total de facturas
  - Facturas pagadas vs pendientes
  - Montos totales por estado
  - Porcentaje de cobros
- **Actualización automática**: Reactivo a cambios en el store

## 🎯 Casos de Uso

### Crear Nueva Factura
1. Clic en "Nueva Factura"
2. Completar formulario con validación en tiempo real
3. Ver vista previa de datos
4. Guardar y ver actualización inmediata en tabla

### Filtrar Facturas
1. Usar los filtros en la parte superior
2. Combinar múltiples filtros (estado + fechas + cliente)
3. Ver resultados filtrados en tiempo real
4. Limpiar filtros cuando sea necesario

### Analizar Estadísticas
1. Ver métricas en las tarjetas superiores
2. Monitorear cobros pendientes
3. Analizar distribución por estados

## 🚀 Próximos Pasos (Mejoras Sugeridas)

### Funcionalidades Adicionales
- [ ] **Editar factura**: Modal para modificar facturas existentes
- [ ] **Eliminar factura**: Con confirmación
- [ ] **Exportar CSV**: Descargar tabla filtrada
- [ ] **Importar CSV**: Con Flatfile para carga masiva
- [ ] **Reportes**: Gráficos y analytics
- [ ] **Búsqueda global**: Por número de factura o cliente
- [ ] **Persistencia**: Conectar con API real

### Mejoras Técnicas
- [ ] **Tests unitarios**: Jest + React Testing Library
- [ ] **Storybook**: Documentación de componentes
- [ ] **TypeScript**: Tipado estático completo
- [ ] **Optimizaciones**: Lazy loading, memoización
- [ ] **PWA**: Funcionalidad offline
- [ ] **Docker**: Containerización

## 🧪 Testing

### Casos de Prueba Manuales

1. **Carga inicial**: Verificar que se muestran las 8 facturas mock
2. **Filtrado por estado**: Cambiar entre "Pagada", "Pendiente", "Todas"
3. **Filtrado por fechas**: Seleccionar rangos válidos
4. **Crear factura válida**: Completar todos los campos correctamente
5. **Validación de formulario**: Probar con datos inválidos
6. **Responsividad**: Probar en diferentes tamaños de pantalla
7. **Estadísticas**: Verificar que los números coinciden con la tabla

## 📝 Notas del Desarrollador

- **Rendimiento**: AG Grid maneja eficientemente grandes volúmenes de datos
- **Estado**: Zustand proporciona un store limpio y reactivo
- **Validación**: Yup asegura integridad de datos en el frontend
- **UI/UX**: CoreUI + TailwindCSS ofrecen una experiencia moderna
- **Escalabilidad**: Estructura modular permite fácil extensión

## 🤝 Contribución

Este proyecto está configurado para desarrollo rápido y iterativo. La estructura modular facilita:
- Agregar nuevas funcionalidades
- Modificar validaciones existentes
- Integrar con APIs reales
- Expandir el sistema de filtros
- Agregar nuevos tipos de reportes

---

**Desarrollado para CustomsCity - Departamento de Contabilidad**  
*Challenge Técnico Frontend - 2024*