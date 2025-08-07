import React, { useState, useEffect, useRef } from 'react';
import { CFormInput, CButton } from '@coreui/react';
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useInvoiceStore } from '../stores/invoiceStore.js';
import CloseButton from './CloseButton.jsx';

const GlobalSearch = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState([]);
  const { invoices } = useInvoiceStore();
  const inputRef = useRef(null);

  // Search functionality
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = invoices.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.amount.toString().includes(searchTerm)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm, invoices]);

  const handleSearchFocus = () => {
    setIsExpanded(true);
  };

  const handleSearchBlur = (e) => {
    // Delay hiding to allow clicking on results
    setTimeout(() => {
      if (!e.relatedTarget || !e.relatedTarget.closest('.search-results')) {
        setIsExpanded(false);
      }
    }, 150);
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
    setIsExpanded(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (invoice) => {
    // Apply filter to show this specific invoice
    const { setFilters } = useInvoiceStore.getState();
    setFilters({ 
      customerName: invoice.customerName,
      status: '',
      dateFrom: '',
      dateTo: '' 
    });
    
    setSearchTerm('');
    setResults([]);
    setIsExpanded(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded-lg">
            <CIcon icon={cilSearch} className="h-4 w-4 text-white" />
          </div>
        </div>
        
        <CFormInput
          ref={inputRef}
          type="text"
          placeholder="🔍 Buscar facturas, clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="pl-12 pr-12 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md"
        />
        
        {searchTerm && (
          <CloseButton 
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
            size="text-gray-400 hover:text-gray-600 text-lg"
            ariaLabel="Limpiar búsqueda"
          />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isExpanded && searchTerm.length >= 2 && (
        <div className="search-results absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="px-4 py-3 text-xs font-semibold text-gray-600 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 rounded-t-xl">
                <div className="flex items-center">
                  <span className="mr-2">📊</span>
                  {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                </div>
              </div>
              {results.slice(0, 8).map((invoice) => (
                <button
                  key={invoice.id}
                  onClick={() => handleResultClick(invoice)}
                  className="w-full px-4 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-blue-600 text-sm bg-blue-100 px-2 py-1 rounded-lg">
                          {invoice.invoiceNumber}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          invoice.status === 'Pagada' 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300' 
                            : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300'
                        }`}>
                          {invoice.status === 'Pagada' ? '✅' : '⏳'} {invoice.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 font-medium truncate mb-1">
                        👤 {invoice.customerName}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className="mr-2">📅</span>
                        {new Date(invoice.date).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 ml-3 bg-gradient-to-r from-green-100 to-green-200 px-3 py-1 rounded-lg">
                      💰 ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </button>
              ))}
              {results.length > 8 && (
                <div className="px-4 py-3 text-xs text-gray-500 text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-xl">
                  <span className="font-semibold">📋</span> ... y {results.length - 8} resultado{results.length - 8 !== 1 ? 's' : ''} más
                </div>
              )}
            </>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <CIcon icon={cilSearch} className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-semibold mb-1">No se encontraron resultados</p>
              <p className="text-xs text-gray-400">
                Intenta con otro término de búsqueda
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;