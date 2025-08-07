import React from 'react';
import { InvoiceStatus } from '../types/invoice.js';

const InvoiceExpansion = ({ invoice, isExpanded, onToggle }) => {
  if (!invoice) return null;

  return (
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 p-6">
        
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            📄 Detalles de {invoice.invoiceNumber}
          </h3>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Customer Info */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-blue-600 mr-2">👤</span>
              Cliente
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Nombre:</span>
                <p className="font-medium text-gray-900">{invoice.customerName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Fecha de Emisión:</span>
                <p className="font-medium text-gray-900">
                  {new Date(invoice.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-green-600 mr-2">💰</span>
              Financiero
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Monto:</span>
                <p className="text-2xl font-bold text-green-600">
                  ${invoice.amount.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Estado:</span>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.status === InvoiceStatus.PAID
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {invoice.status === InvoiceStatus.PAID ? '✅ Pagada' : '⏳ Pendiente'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-purple-600 mr-2">⚡</span>
              Acciones
            </h4>
            <div className="space-y-2">
              {invoice.status === InvoiceStatus.PENDING && (
                <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-3 rounded transition-all duration-200 hover:scale-105">
                  💳 Marcar como Pagada
                </button>
              )}
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded transition-all duration-200 hover:scale-105">
                📄 Descargar PDF
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 px-3 rounded transition-all duration-200">
                ✏️ Editar
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="text-purple-600 mr-2">📅</span>
            Historial de la Factura
          </h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Creada</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                invoice.status === InvoiceStatus.PAID ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-600">
                {invoice.status === InvoiceStatus.PAID ? 'Pagada' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              {invoice.amount > 1000 ? '💎' : invoice.amount > 500 ? '⭐' : '📊'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {invoice.amount > 1000 ? 'Premium' : invoice.amount > 500 ? 'Estándar' : 'Básico'}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {invoice.status === InvoiceStatus.PAID ? '✅' : '⏳'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {invoice.status === InvoiceStatus.PAID ? 'Completada' : 'En Proceso'}
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
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-600">
              {invoice.amount > 2000 ? '🔥' : invoice.amount > 1000 ? '⚡' : '📈'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {invoice.amount > 2000 ? 'Alto Valor' : invoice.amount > 1000 ? 'Medio' : 'Básico'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceExpansion;
