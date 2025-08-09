import React, { useEffect } from 'react';
import { InvoiceStatus } from '../types/invoice.js';
import CloseButton from './CloseButton.jsx';

const InvoicePreview = ({ invoice, isOpen, onClose, onPay, payingInvoiceId }) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!invoice) return null;

  return (
    <>
      {/* Full Screen Overlay - Higher z-index to appear over everything */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Modal Container - Appears over entire dashboard */}
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Modal Content */}
        <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📄 Detalle de Factura</h2>
              <p className="text-sm text-gray-600 mt-1">Vista completa de la información</p>
            </div>
            <CloseButton 
              onClick={onClose}
              className="relative top-0 right-0 p-3 rounded-full bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all shadow-sm"
            />
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          
            {/* Main Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Invoice Number & Status */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white col-span-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-3xl font-bold">{invoice.invoiceNumber}</h3>
                    <p className="text-blue-100 mt-1 text-lg">Número de Factura</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    invoice.status === InvoiceStatus.PAID
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {invoice.status === InvoiceStatus.PAID ? '✅ Pagada' : '⏳ Pendiente'}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                  <span className="text-blue-600 mr-2">👤</span>
                  Información del Cliente
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 block text-sm">Cliente:</span>
                    <span className="font-medium text-gray-900 text-lg">{invoice.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-sm">Fecha:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(invoice.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                  <span className="text-green-600 mr-2">💰</span>
                  Detalles del Monto
                </h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    ${invoice.amount.toLocaleString('en-US', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Monto Total (USD)</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                <span className="text-purple-600 mr-2">📅</span>
                Historial
              </h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Factura Creada</p>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-4 ${
                    invoice.status === InvoiceStatus.PAID ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {invoice.status === InvoiceStatus.PAID ? 'Pago Confirmado' : 'Pendiente de Pago'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {invoice.status === InvoiceStatus.PAID 
                        ? 'Pago procesado exitosamente' 
                        : 'Esperando confirmación de pago'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions and Stats */}
            <div className="space-y-6">
              {/* Action Button - Only show for pending invoices */}
              {invoice.status === InvoiceStatus.PENDING && (
                <div className="flex gap-4">
                  <button 
                    className={`flex-1 font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center text-lg ${
                      payingInvoiceId === invoice.id 
                        ? 'bg-yellow-500 cursor-wait animate-pulse text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                    onClick={() => onPay && onPay(invoice)}
                    disabled={payingInvoiceId === invoice.id}
                  >
                    {payingInvoiceId === invoice.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando Pago...
                      </>
                    ) : (
                      <>
                        <span className="mr-3">💳</span>
                        Marcar como Pagada
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {invoice.amount > 1000 ? '💎' : invoice.amount > 500 ? '⭐' : '📊'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {invoice.amount > 1000 ? 'Premium' : invoice.amount > 500 ? 'Estándar' : 'Básico'}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {new Date(invoice.date).getMonth() === new Date().getMonth() ? '🆕' : '📅'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(invoice.date).getMonth() === new Date().getMonth() ? 'Este Mes' : 'Mes Anterior'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600 mb-2">
                    📋
                  </div>
                  <div className="text-sm text-gray-600">
                    Factura #{invoice.invoiceNumber.split('-').pop()}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button 
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center"
                >
                  <span className="mr-2">✕</span>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePreview;
