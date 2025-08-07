import React from 'react';
import { CButton, CFormInput, CFormSelect, CButtonGroup } from '@coreui/react';
import { cilFilterX, cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useInvoiceStore } from '../stores/invoiceStore.js';
import { InvoiceStatus } from '../types/invoice.js';

const InvoiceFilters = () => {
  const { filters, setFilters, clearFilters } = useInvoiceStore();

  const handleFilterChange = (field, value) => {
    setFilters({ [field]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg mr-3">
          <span className="text-white text-lg">🔍</span>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg mb-1">Filtros Avanzados</h4>
          <p className="text-sm text-gray-600">Refina tu búsqueda de facturas</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Status Filter */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <span className="text-blue-600 mr-2">🏷️</span>
            Estado
          </label>
          <CFormSelect
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
          >
            <option value="">Todos los estados</option>
            <option value={InvoiceStatus.PAID}>Pagada</option>
            <option value={InvoiceStatus.PENDING}>Pendiente</option>
          </CFormSelect>
        </div>

        {/* Date From Filter */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <span className="text-green-600 mr-2">📅</span>
            Fecha Desde
          </label>
          <CFormInput
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
          />
        </div>

        {/* Date To Filter */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <span className="text-green-600 mr-2">📅</span>
            Fecha Hasta
          </label>
          <CFormInput
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
          />
        </div>

        {/* Customer Name Filter */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <span className="text-purple-600 mr-2">👤</span>
            Cliente
          </label>
          <CFormInput
            type="text"
            placeholder="Buscar por nombre..."
            value={filters.customerName}
            onChange={(e) => handleFilterChange('customerName', e.target.value)}
            className="border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="sm:col-span-2 lg:col-span-1">
          <CButton
            color="secondary"
            variant="outline"
            onClick={handleClearFilters}
            className="w-full flex items-center justify-center border-2 hover:border-red-500 hover:bg-red-50 transition-all duration-300 font-semibold rounded-lg"
            size="sm"
          >
            <CIcon icon={cilFilterX} size="sm" className="me-2" />
            <span className="d-none d-sm-inline">Limpiar </span>Filtros
          </CButton>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.status || filters.dateFrom || filters.dateTo || filters.customerName) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded-lg mr-2">
              <span className="text-white text-xs">⚡</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Filtros activos:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 shadow-sm">
                <span className="mr-1">🏷️</span>
                Estado: {filters.status}
              </span>
            )}
            
            {filters.dateFrom && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 shadow-sm">
                <span className="mr-1">📅</span>
                Desde: {new Date(filters.dateFrom).toLocaleDateString('es-ES')}
              </span>
            )}
            
            {filters.dateTo && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 shadow-sm">
                <span className="mr-1">📅</span>
                Hasta: {new Date(filters.dateTo).toLocaleDateString('es-ES')}
              </span>
            )}
            
            {filters.customerName && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 shadow-sm">
                <span className="mr-1">👤</span>
                Cliente: {filters.customerName}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;