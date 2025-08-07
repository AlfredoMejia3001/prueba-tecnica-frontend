import React, { useState, useEffect, useRef } from 'react';
import { CFormInput, CButton } from '@coreui/react';
import { cilSearch, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useInvoiceStore } from '../stores/invoiceStore.js';

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
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CIcon icon={cilSearch} className="h-4 w-4 text-gray-400" />
        </div>
        
        <CFormInput
          ref={inputRef}
          type="text"
          placeholder="Buscar facturas, clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="pl-10 pr-10 py-2 text-sm border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <CIcon icon={cilX} className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isExpanded && searchTerm.length >= 2 && (
        <div className="search-results absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
              </div>
              {results.slice(0, 8).map((invoice) => (
                <button
                  key={invoice.id}
                  onClick={() => handleResultClick(invoice)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-blue-600 text-sm">
                          {invoice.invoiceNumber}
                        </span>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          invoice.status === 'Pagada' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 truncate mt-1">
                        {invoice.customerName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(invoice.date).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 ml-2">
                      ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </button>
              ))}
              {results.length > 8 && (
                <div className="px-4 py-2 text-xs text-gray-500 text-center bg-gray-50">
                  ... y {results.length - 8} resultado{results.length - 8 !== 1 ? 's' : ''} más
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              <CIcon icon={cilSearch} className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No se encontraron resultados</p>
              <p className="text-xs text-gray-400 mt-1">
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