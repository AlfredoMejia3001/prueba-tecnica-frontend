import React, { useEffect, useRef } from 'react';
import { InvoiceStatus } from '../types/invoice.js';
import CloseButton from './CloseButton.jsx';

const InvoiceCard = ({ invoice, isVisible, position, onClose }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (isVisible && cardRef.current) {
      // Asegurar que la card esté visible en la pantalla
      const rect = cardRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let newTop = position.top;
      let newLeft = position.left;

      // Ajustar posición si se sale de la pantalla
      if (rect.right > viewport.width) {
        newLeft = viewport.width - rect.width - 20;
      }
      if (rect.bottom > viewport.height) {
        newTop = viewport.height - rect.height - 20;
      }
      if (newLeft < 0) newLeft = 20;
      if (newTop < 0) newTop = 20;

      cardRef.current.style.top = `${newTop}px`;
      cardRef.current.style.left = `${newLeft}px`;
    }
  }, [isVisible, position]);

  if (!isVisible || !invoice) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Card */}
      <div 
        ref={cardRef}
        className="fixed z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-200 ease-out"
        style={{
          top: position.top,
          left: position.left
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{invoice.invoiceNumber}</h3>
              <p className="text-blue-100 text-sm mt-1">Factura</p>
            </div>
            <CloseButton 
              onClick={onClose}
              className="relative top-0 right-0 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
              size="text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          
          {/* Status Badge */}
          <div className="flex justify-center">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              invoice.status === InvoiceStatus.PAID
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {invoice.status === InvoiceStatus.PAID ? '✅ Pagada' : '⏳ Pendiente'}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-600 mr-2">👤</span>
              Cliente
            </h4>
            <p className="text-gray-900 font-medium">{invoice.customerName}</p>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(invoice.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Amount */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="text-green-600 mr-2">💰</span>
              Monto
            </h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${invoice.amount.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </div>
              <p className="text-xs text-gray-600 mt-1">USD</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            {invoice.status === InvoiceStatus.PENDING && (
              <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105">
                💳 Pagar
              </button>
            )}
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105">
              📄 PDF
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 px-3 rounded-lg transition-all duration-200">
              ✏️ Editar
            </button>
            <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-semibold py-2 px-3 rounded-lg transition-all duration-200">
              📊 Detalles
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-blue-600">
                {invoice.amount > 1000 ? '💎' : '📊'}
              </div>
              <div className="text-xs text-gray-600">
                {invoice.amount > 1000 ? 'Premium' : 'Estándar'}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-green-600">
                {new Date(invoice.date).getMonth() === new Date().getMonth() ? '🆕' : '📅'}
              </div>
              <div className="text-xs text-gray-600">
                {new Date(invoice.date).getMonth() === new Date().getMonth() ? 'Este Mes' : 'Anterior'}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-orange-600">
                {invoice.amount > 2000 ? '🔥' : '📈'}
              </div>
              <div className="text-xs text-gray-600">
                {invoice.amount > 2000 ? 'Alto' : 'Normal'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceCard;
