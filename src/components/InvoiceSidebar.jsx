import React from 'react';
import { InvoiceStatus } from '../types/invoice.js';
import CloseButton from './CloseButton.jsx';

const InvoiceSidebar = ({ invoice, isOpen, onClose, onPay, payingInvoiceId }) => {
  if (!invoice) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">📄 Factura</h2>
            <p className="text-sm text-gray-600 mt-1">Vista detallada</p>
          </div>
          <CloseButton 
            onClick={onClose}
            className="relative top-0 right-0 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all shadow-sm"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          
          {/* Invoice Number & Status */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{invoice.invoiceNumber}</h3>
                <p className="text-blue-100 mt-1">Número de Factura</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                invoice.status === InvoiceStatus.PAID
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}>
                {invoice.status === InvoiceStatus.PAID ? '✅ Pagada' : '⏳ Pendiente'}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-blue-600 mr-2">👤</span>
              Información del Cliente
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium text-gray-900">{invoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-green-600 mr-2">💰</span>
              Detalles del Monto
            </h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${invoice.amount.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </div>
              <p className="text-sm text-gray-600 mt-1">Monto Total (USD)</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-purple-600 mr-2">📅</span>
              Historial
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Factura Creada</p>
                  <p className="text-xs text-gray-500">
                    {new Date(invoice.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  invoice.status === InvoiceStatus.PAID ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {invoice.status === InvoiceStatus.PAID ? 'Pago Confirmado' : 'Pendiente de Pago'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {invoice.status === InvoiceStatus.PAID 
                      ? 'Pago procesado exitosamente' 
                      : 'Esperando confirmación de pago'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {invoice.status === InvoiceStatus.PENDING && (
              <button 
                className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center ${
                  payingInvoiceId === invoice.id 
                    ? 'bg-yellow-500 cursor-wait animate-pulse text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
                onClick={() => onPay && onPay(invoice)}
                disabled={payingInvoiceId === invoice.id}
              >
                {payingInvoiceId === invoice.id ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Pagando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💳</span>
                    Marcar como Pagada
                  </>
                )}
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">
                {invoice.amount > 1000 ? '💎' : invoice.amount > 500 ? '⭐' : '📊'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {invoice.amount > 1000 ? 'Premium' : invoice.amount > 500 ? 'Estándar' : 'Básico'}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">
                {new Date(invoice.date).getMonth() === new Date().getMonth() ? '🆕' : '📅'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {new Date(invoice.date).getMonth() === new Date().getMonth() ? 'Este Mes' : 'Mes Anterior'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceSidebar;
