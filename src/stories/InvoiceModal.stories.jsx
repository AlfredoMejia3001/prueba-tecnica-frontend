import React from 'react';
import { InvoiceStatus } from '../types/invoice';

// =================================
// 2️⃣ Componente wrapper simplificado
// =================================

// Simple mock component that replicates InvoiceModal structure
const MockInvoiceModal = ({ storeState = {} }) => {
  const {
    isModalOpen = true,
    loading = false,
    error = null,
    simulateSlowNetwork = false,
    simulateError = false,
  } = storeState;

  const [formData, setFormData] = React.useState({
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    status: InvoiceStatus.PENDING,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(loading);
  const [submitError, setSubmitError] = React.useState(error);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Enviando formulario:', formData);
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (simulateError) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('Error de conexión con el servidor');
      }

      const delay = simulateSlowNetwork ? 3000 : 800;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log('✅ Factura creada exitosamente');
      // En un caso real, aquí se cerraría el modal
    } catch (err) {
      console.error('❌ Error:', err.message);
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    console.log('🔴 Cerrando modal');
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '500' }}>
            Nueva Factura
          </h4>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6c757d',
              padding: '0',
              width: '24px',
              height: '24px',
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px' }}>
            {submitError && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '20px',
                border: '1px solid #f5c6cb',
              }}>
                {submitError}
              </div>
            )}

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Customer Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#495057',
                }}>
                  Nombre del Cliente <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Ej: Empresa ABC S.A."
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Date */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#495057',
                  }}>
                    Fecha <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Amount */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#495057',
                  }}>
                    Monto (USD) <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#495057',
                }}>
                  Estado <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white',
                  }}
                >
                  <option value={InvoiceStatus.PENDING}>Pendiente</option>
                  <option value={InvoiceStatus.PAID}>Pagada</option>
                </select>
              </div>

              {/* Preview */}
              <div style={{
                backgroundColor: '#e7f3ff',
                border: '1px solid #b3d7ff',
                borderRadius: '6px',
                padding: '16px',
              }}>
                <h5 style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0056b3',
                }}>
                  Vista Previa
                </h5>
                <div style={{ fontSize: '14px', color: '#0056b3' }}>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Cliente:</strong> {formData.customerName || 'No especificado'}
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Fecha:</strong> {formData.date ? new Date(formData.date).toLocaleDateString('es-ES') : 'No especificada'}
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Monto:</strong> {formData.amount ? `$${parseFloat(formData.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Estado:</strong> {formData.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #dee2e6',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                border: '1px solid #6c757d',
                backgroundColor: 'transparent',
                color: '#6c757d',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              ✕ Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
                color: 'white',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  Guardando...
                </>
              ) : (
                <>💾 Crear Factura</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InvoiceModalWrapper = ({
  storeState = {},
  children,
  showBackground = true,
  showControls = false,
  ...props
}) => {
  const [localModalOpen, setLocalModalOpen] = React.useState(storeState.isModalOpen ?? true);
  
  const currentStoreState = React.useMemo(() => ({
    ...storeState,
    isModalOpen: localModalOpen,
  }), [storeState, localModalOpen]);

  const toggleModal = () => {
    setLocalModalOpen(prev => !prev);
  };

  return (
    <div
      style={{
        minHeight: showBackground ? '100vh' : 'auto',
        backgroundColor: showBackground ? '#f8f9fa' : 'transparent',
        padding: showBackground ? '20px' : '0',
        position: 'relative',
      }}
    >
      {/* Add CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {showControls && (
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <button
            onClick={toggleModal}
            style={{
              padding: '12px 24px',
              backgroundColor: localModalOpen ? '#dc3545' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            {localModalOpen ? '✕ Cerrar Modal' : '+ Abrir Modal'}
          </button>
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#666',
            fontFamily: 'monospace'
          }}>
            Estado: {localModalOpen ? 'ABIERTO' : 'CERRADO'}
          </div>
        </div>
      )}
      
      {/* Use our mock component instead of the original */}
      <MockInvoiceModal storeState={currentStoreState} {...props} />
      {children}
      
      {/* Debug info */}
      {showBackground && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 12px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'monospace',
          zIndex: 9999,
        }}>
          Modal: {localModalOpen ? '✅ VISIBLE' : '❌ OCULTO'}
        </div>
      )}
    </div>
  );
};

// =============================
// 3️⃣ Configuración de Storybook
// =============================
export default {
  title: 'Components/InvoiceModal',
  component: InvoiceModalWrapper,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# InvoiceModal Component

Modal para crear nuevas facturas con validación completa usando Formik y Yup.

## Características principales:
- ✅ Validación en tiempo real
- 🔄 Estados de carga y error
- 📱 Diseño responsivo
- ♿ Accesibilidad completa
- 🎨 Vista previa en tiempo real

## Validaciones:
- **Nombre del cliente**: Requerido, 2-100 caracteres
- **Fecha**: Requerida, no puede ser futura
- **Monto**: Requerido, positivo, $0.01 - $999,999.99
- **Estado**: Requerido (Pendiente/Pagada)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    storeState: { 
      control: 'object',
      description: 'Estado del store para simular diferentes escenarios',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{ isModalOpen: true, loading: false }' },
      },
    },
    showBackground: { 
      control: 'boolean',
      description: 'Mostrar fondo contextual',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showControls: { 
      control: 'boolean',
      description: 'Mostrar controles interactivos',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    storeState: { isModalOpen: true, loading: false, error: null },
    showBackground: true,
    showControls: false,
  },
  // Add global decorators for better styling
  decorators: [
    (Story) => (
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
};

// =============================
// 4️⃣ Stories
// =============================

// 📖 Stories básicas
export const Default = {
  name: '🔧 Por defecto',
  args: { 
    storeState: { isModalOpen: true, loading: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal abierto en estado inicial, listo para crear una nueva factura.',
      },
    },
  },
};

export const Closed = {
  name: '❌ Modal cerrado',
  args: { 
    storeState: { isModalOpen: false, loading: false }, 
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal cerrado con controles para abrirlo interactivamente.',
      },
    },
  },
};

export const Loading = {
  name: '⏳ Estado de carga',
  args: { 
    storeState: { isModalOpen: true, loading: true },
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal mostrando spinner de carga durante la creación de factura.',
      },
    },
  },
};

export const WithError = {
  name: '❌ Con error',
  args: {
    storeState: {
      isModalOpen: true,
      loading: false,
      error: 'Error de conexión con el servidor. Verifique su conexión e intente nuevamente.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal mostrando mensaje de error cuando falla la creación.',
      },
    },
  },
};

// 🎭 Stories interactivas
export const Interactive = {
  name: '🎮 Interactivo',
  args: { 
    storeState: { isModalOpen: false, loading: false }, 
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal con controles interactivos para probar funcionalidad completa.',
      },
    },
  },
};

export const SlowNetwork = {
  name: '🐌 Red lenta',
  args: { 
    storeState: { isModalOpen: true, simulateSlowNetwork: true },
  },
  parameters: {
    docs: {
      description: {
        story: 'Simula conexión lenta (3 segundos) para probar estado de carga extendido.',
      },
    },
  },
};

export const NetworkError = {
  name: '🔌 Error de red',
  args: { 
    storeState: { isModalOpen: true, simulateError: true },
  },
  parameters: {
    docs: {
      description: {
        story: 'Simula error de red para probar manejo de errores del formulario.',
      },
    },
  },
};

// 📱 Stories responsivas
export const Mobile = {
  name: '📱 Vista móvil',
  args: { 
    storeState: { isModalOpen: true, loading: false },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Modal optimizado para dispositivos móviles con layout adaptativo.',
      },
    },
  },
};

export const Tablet = {
  name: '📟 Vista tablet',
  args: { 
    storeState: { isModalOpen: true, loading: false },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Modal en dispositivos tablet mostrando layout de dos columnas.',
      },
    },
  },
};

// 🎨 Stories de formulario
export const PrefilledForm = {
  name: '📝 Formulario prellenado',
  args: { 
    storeState: { isModalOpen: true, loading: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal con datos de ejemplo para demostrar vista previa y validación.',
      },
    },
  },
  render: (args) => {
    React.useEffect(() => {
      // Simular llenado automático después de un breve delay
      const timer = setTimeout(() => {
        const nameInput = document.querySelector('input[name="customerName"]');
        const dateInput = document.querySelector('input[name="date"]');
        const amountInput = document.querySelector('input[name="amount"]');
        const statusSelect = document.querySelector('select[name="status"]');

        if (nameInput) {
          nameInput.value = 'Empresa Ejemplo S.A.';
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          nameInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (dateInput) {
          dateInput.value = '2024-01-15';
          dateInput.dispatchEvent(new Event('input', { bubbles: true }));
          dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (amountInput) {
          amountInput.value = '1250.75';
          amountInput.dispatchEvent(new Event('input', { bubbles: true }));
          amountInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (statusSelect) {
          statusSelect.value = InvoiceStatus.PAID;
          statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

    return <InvoiceModalWrapper {...args} />;
  },
};

// ♿ Stories de accesibilidad
export const AccessibilityFocus = {
  name: '♿ Navegación por teclado',
  args: { 
    storeState: { isModalOpen: true, loading: false },
    showBackground: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demuestra navegación por teclado. Usa Tab para navegar entre campos.',
      },
    },
  },
  render: (args) => {
    React.useEffect(() => {
      // Auto-focus en el primer campo
      const timer = setTimeout(() => {
        const firstInput = document.querySelector('input[name="customerName"]');
        if (firstInput) {
          firstInput.focus();
        }
      }, 500);

      return () => clearTimeout(timer);
    }, []);

    return <InvoiceModalWrapper {...args} />;
  },
};

// 🔧 Story de desarrollo
export const Development = {
  name: '🔧 Modo desarrollo',
  args: { 
    storeState: { isModalOpen: true, loading: false },
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal con herramientas de desarrollo y controles para testing.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
  render: (args) => {
    const [debugInfo, setDebugInfo] = React.useState({});
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setDebugInfo({
          timestamp: new Date().toLocaleTimeString(),
          modalState: args.storeState,
          formElements: {
            customerName: document.querySelector('input[name="customerName"]')?.value || '',
            date: document.querySelector('input[name="date"]')?.value || '',
            amount: document.querySelector('input[name="amount"]')?.value || '',
            status: document.querySelector('select[name="status"]')?.value || '',
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [args.storeState]);

    return (
      <div>
        {/* Debug panel */}
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 10000,
          backgroundColor: '#000',
          color: '#0f0',
          padding: '10px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '11px',
          border: '1px solid #0f0',
          maxWidth: '300px',
          opacity: 0.9,
        }}>
          <div style={{ color: '#ff0', marginBottom: '5px' }}>🔧 DEV MODE</div>
          <div>⏰ {debugInfo.timestamp}</div>
          <div>📊 Modal: {debugInfo.modalState?.isModalOpen ? 'OPEN' : 'CLOSED'}</div>
          <div>🔄 Loading: {debugInfo.modalState?.loading ? 'YES' : 'NO'}</div>
          <div style={{ marginTop: '5px', fontSize: '10px' }}>
            <div>📝 Form Data:</div>
            <div style={{ marginLeft: '10px' }}>
              {Object.entries(debugInfo.formElements || {}).map(([key, value]) => (
                <div key={key}>{key}: {value || 'empty'}</div>
              ))}
            </div>
          </div>
        </div>
        
        <InvoiceModalWrapper {...args} />
      </div>
    );
  },
};
