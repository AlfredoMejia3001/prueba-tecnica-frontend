import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useInvoiceStore } from '../stores/invoiceStore.js';
import { InvoiceStatus } from '../types/invoice.js';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const InvoiceTable = () => {
  const { filteredInvoices, updateInvoice } = useInvoiceStore();
  const [isMobile, setIsMobile] = useState(false);

  // No need for local state anymore - using global store

  // Modal
  const [modalInvoice, setModalInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (invoice) => {
    setModalInvoice(invoice);
    setShowModal(true);
  };

  const [payingInvoiceId, setPayingInvoiceId] = useState(null);

  const handlePay = (invoice) => {
    setPayingInvoiceId(invoice.id);
    
    // Add visual feedback
    setTimeout(() => {
      updateInvoice(invoice.id, { status: InvoiceStatus.PAID });
      setPayingInvoiceId(null);
      
      // Trigger stats update animation
      const event = new CustomEvent('invoice-updated', { 
        detail: { type: 'payment', invoice } 
      });
      window.dispatchEvent(event);
    }, 600);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalInvoice(null);
  };


  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Column definitions for AG Grid
  // handlers ya definidos arriba (no duplicar)
  const columnDefs = useMemo(() => [
    {
      field: 'invoiceNumber',
      headerName: 'Número de Factura',
      width: 180,
      pinned: 'left',
      cellClass: 'font-medium text-blue-600'
    },
    {
      field: 'customerName',
      headerName: 'Nombre del Cliente',
      width: 250,
      flex: 1
    },
    {
      field: 'date',
      headerName: 'Fecha',
      width: 120,
      cellRenderer: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString('es-ES');
      },
      comparator: (valueA, valueB) => {
        return new Date(valueA) - new Date(valueB);
      }
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 130,
      cellRenderer: (params) => {
        const status = params.value;
        const statusMap = {
          [InvoiceStatus.PAID]: {
            label: 'Pagada',
            className: 'bg-green-100 text-green-800 border-green-200',
            icon: (
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            )
          },
          [InvoiceStatus.PENDING]: {
            label: 'Pendiente',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: (
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
            )
          },
        };
        const statusObj = statusMap[status] || {
          label: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: null
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusObj.className}`}>
            {statusObj.icon}
            {statusObj.label}
          </span>
        );
      }
    },
    {
      field: 'amount',
      headerName: 'Monto (USD)',
      width: 140,
      cellRenderer: (params) => {
        return `$${parseFloat(params.value || 0).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      },
      cellClass: 'text-right font-medium',
      comparator: (valueA, valueB) => {
        return parseFloat(valueA || 0) - parseFloat(valueB || 0);
      }
    },
    {
      headerName: 'Acciones',
      field: 'actions',
      width: 180,
      pinned: 'right',
      cellRenderer: (params) => {
        const invoice = params.data;
        return (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-all duration-200 hover:scale-105"
              onClick={() => handleView(invoice)}
              type="button"
            >
              Ver
            </button>
            {invoice.status === InvoiceStatus.PENDING && (
              <button
                className={`px-3 py-1 rounded text-white text-xs font-semibold transition-all duration-300 ${
                  payingInvoiceId === invoice.id 
                    ? 'bg-yellow-500 cursor-wait animate-pulse' 
                    : 'bg-green-500 hover:bg-green-600 hover:scale-105'
                }`}
                onClick={() => handlePay(invoice)}
                type="button"
                disabled={payingInvoiceId === invoice.id}
              >
                {payingInvoiceId === invoice.id ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Pagando...
                  </>
                ) : 'Pagar'}
              </button>
            )}
          </div>
        );
      },
      cellClass: 'text-center',
      sortable: false,
      resizable: false,
    }
  ], []);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    minWidth: 100
  }), []);

  // Grid options
  const gridOptions = useMemo(() => ({
    rowSelection: 'single',
    suppressRowClickSelection: false,
    rowHeight: 50,
    headerHeight: 50,
    animateRows: true,
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [10, 20, 50, 100],
    enableCellTextSelection: true,
    suppressMenuHide: true
  }), []);

  // Handle row selection
  const onSelectionChanged = useCallback((event) => {
    const selectedRows = event.api.getSelectedRows();
    console.log('Selected invoice:', selectedRows[0]);
  }, []);

  // Mobile card view component
  const MobileInvoiceCards = () => (
    <div className="space-y-4">
      {filteredInvoices.map((invoice) => (
        <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-blue-600 text-sm">
                {invoice.invoiceNumber}
              </h4>
              <p className="text-gray-700 font-medium text-sm mt-1">
                {invoice.customerName}
              </p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              invoice.status === InvoiceStatus.PAID
                ? 'bg-green-100 text-green-800 border-green-200'
                : invoice.status === InvoiceStatus.PENDING
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  : 'bg-gray-100 text-gray-800 border-gray-200'
            }`}>
              {invoice.status === InvoiceStatus.PAID && (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              )}
              {invoice.status === InvoiceStatus.PENDING && (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
              )}
              {invoice.status === InvoiceStatus.PAID ? 'Pagada' : invoice.status === InvoiceStatus.PENDING ? 'Pendiente' : invoice.status}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-600">
              📅 {new Date(invoice.date).toLocaleDateString('es-ES')}
            </div>
            <div className="font-bold text-gray-900 text-lg">
              ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-all duration-200 hover:scale-105"
              onClick={() => handleView(invoice)}
              type="button"
            >
              Ver
            </button>
            {invoice.status === InvoiceStatus.PENDING && (
              <button
                className={`px-3 py-1 rounded text-white text-xs font-semibold transition-all duration-300 ${
                  payingInvoiceId === invoice.id 
                    ? 'bg-yellow-500 cursor-wait animate-pulse' 
                    : 'bg-green-500 hover:bg-green-600 hover:scale-105'
                }`}
                onClick={() => handlePay(invoice)}
                type="button"
                disabled={payingInvoiceId === invoice.id}
              >
                {payingInvoiceId === invoice.id ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Pagando...
                  </>
                ) : 'Pagar'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Status cell renderer
  const StatusCellRenderer = (params) => {
    const status = params.value;
    const statusMap = {
      [InvoiceStatus.PAID]: {
        label: 'Pagada',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        )
      },
      [InvoiceStatus.PENDING]: {
        label: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
        )
      },
    };
    const statusObj = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: null
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusObj.className}`}>
        {statusObj.icon}
        {statusObj.label}
      </span>
    );
  };

  return (
    <div className="w-full h-full">
      {/* Table Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Facturas
          </h3>
          <p className="text-sm text-gray-600">
            {filteredInvoices.length} facturas encontradas
          </p>
        </div>
        
        {/* View toggle for debugging (optional) */}
        <div className="text-xs text-gray-500 md:hidden">
          📱 Vista móvil
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="text-center">
          <div className="font-semibold text-gray-900">Total Facturas</div>
          <div className="text-gray-600">{filteredInvoices.length}</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-600">Pagadas</div>
          <div className="text-gray-600">
            {filteredInvoices.filter(invoice => invoice.status === InvoiceStatus.PAID).length}
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-yellow-600">Pendientes</div>
          <div className="text-gray-600">
            {filteredInvoices.filter(invoice => invoice.status === InvoiceStatus.PENDING).length}
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-600">Monto Total</div>
          <div className="text-gray-600">
            ${filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
              .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Table Content */}
      {isMobile ? (
        <MobileInvoiceCards />
      ) : (
        <div className="ag-theme-alpine w-full h-96">
          <AgGridReact
            rowData={filteredInvoices}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            onSelectionChanged={onSelectionChanged}
            domLayout="normal"
          />
        </div>
      )}

      {/* Modal para vista previa de factura */}
      {showModal && modalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 animate-fade-in" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-modal-enter transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4 text-blue-700">Vista previa de factura</h2>
            <div className="mb-2"><span className="font-semibold">Número:</span> {modalInvoice.invoiceNumber}</div>
            <div className="mb-2"><span className="font-semibold">Cliente:</span> {modalInvoice.customerName}</div>
            <div className="mb-2"><span className="font-semibold">Fecha:</span> {new Date(modalInvoice.date).toLocaleDateString('es-ES')}</div>
            <div className="mb-2"><span className="font-semibold">Monto:</span> ${modalInvoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="mb-2"><span className="font-semibold">Estado:</span> {modalInvoice.status === InvoiceStatus.PAID ? 'Pagada' : modalInvoice.status === InvoiceStatus.PENDING ? 'Pendiente' : modalInvoice.status}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceTable;