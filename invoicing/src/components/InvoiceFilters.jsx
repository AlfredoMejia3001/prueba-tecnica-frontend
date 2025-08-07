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
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <CFormSelect
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value={InvoiceStatus.PAID}>Pagada</option>
            <option value={InvoiceStatus.PENDING}>Pendiente</option>
          </CFormSelect>
        </div>

        {/* Date From Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Desde
          </label>
          <CFormInput
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Date To Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Hasta
          </label>
          <CFormInput
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Customer Name Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente
          </label>
          <CFormInput
            type="text"
            placeholder="Buscar por nombre..."
            value={filters.customerName}
            onChange={(e) => handleFilterChange('customerName', e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="sm:col-span-2 lg:col-span-1">
          <CButton
            color="secondary"
            variant="outline"
            onClick={handleClearFilters}
            className="w-full flex items-center justify-center"
            size="sm"
          >
            <CIcon icon={cilFilterX} size="sm" className="me-1" />
            <span className="d-none d-sm-inline">Limpiar </span>Filtros
          </CButton>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.status || filters.dateFrom || filters.dateTo || filters.customerName) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
            
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Estado: {filters.status}
              </span>
            )}
            
            {filters.dateFrom && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Desde: {new Date(filters.dateFrom).toLocaleDateString('es-ES')}
              </span>
            )}
            
            {filters.dateTo && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Hasta: {new Date(filters.dateTo).toLocaleDateString('es-ES')}
              </span>
            )}
            
            {filters.customerName && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
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