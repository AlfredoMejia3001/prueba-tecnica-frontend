import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useInvoiceStore } from '../stores/invoiceStore.js';
import { InvoiceStatus } from '../types/invoice.js';
import CloseButton from './CloseButton.jsx';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Optimized cell renderers as separate components
const DateCellRenderer = React.memo(({ value }) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('es-ES');
});

const AmountCellRenderer = React.memo(({ value }) => {
  return `$${parseFloat(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
});

const StatusCellRenderer = React.memo(({ value }) => {
  const statusMap = {
    [InvoiceStatus.PAID]: {
      label: 'Pagada',
      className: 'bg-green-100 text-green-800 border-green-200',
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    [InvoiceStatus.PENDING]: {
      label: 'Pendiente',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
        </svg>
      )
    },
  };
  
  const statusObj = statusMap[value] || {
    label: value,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: null
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusObj.className}`}>
      {statusObj.icon}
      {statusObj.label}
    </span>
  );
});

const ActionsCellRenderer = React.memo(({ data, onView, onPay, payingInvoiceId }) => {
  return (
    <div className="flex gap-2">
      <button
        className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-all duration-200 hover:scale-105"
        onClick={() => onView(data)}
        type="button"
      >
        Ver
      </button>
      {data.status === InvoiceStatus.PENDING && (
        <button
          className={`px-3 py-1 rounded text-white text-xs font-semibold transition-all duration-300 ${
            payingInvoiceId === data.id 
              ? 'bg-yellow-500 cursor-wait animate-pulse' 
              : 'bg-green-500 hover:bg-green-600 hover:scale-105'
          }`}
          onClick={() => onPay(data)}
          type="button"
          disabled={payingInvoiceId === data.id}
        >
          {payingInvoiceId === data.id ? (
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
});

// Main component with React.memo for performance
const InvoiceTable = React.memo(() => {
  const { 
    filteredInvoices, 
    updateInvoice, 
    openInvoiceDetail, 
    setPayingInvoiceId, 
    payingInvoiceId 
  } = useInvoiceStore();
  const [isMobile, setIsMobile] = useState(false);
  
  // Grid API reference for optimizations
  const gridRef = useRef(null);

  // Optimized event handlers with useCallback
  const handleView = useCallback((invoice) => {
    openInvoiceDetail(invoice);
  }, [openInvoiceDetail]);

  const handlePay = useCallback((invoice) => {
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
  }, [updateInvoice, setPayingInvoiceId]);

  // Optimized mobile detection with debouncing
  useEffect(() => {
    let timeoutId;
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 100);
    };
    
    checkIsMobile();
    window.addEventListener('resize', debouncedCheck);
    
    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  // Optimized column definitions with memoization
  const columnDefs = useMemo(() => [
    {
      field: 'invoiceNumber',
      headerName: 'Número de Factura',
      width: 180,
      pinned: 'left',
      cellClass: 'font-medium text-blue-600',
      sortable: true,
      filter: true,
      suppressMenu: false,
      menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab']
    },
    {
      field: 'customerName',
      headerName: 'Nombre del Cliente',
      width: 250,
      flex: 1,
      sortable: true,
      filter: true,
      suppressMenu: false,
      menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab']
    },
    {
      field: 'date',
      headerName: 'Fecha',
      width: 120,
      cellRenderer: DateCellRenderer,
      comparator: (valueA, valueB) => new Date(valueA) - new Date(valueB),
      sortable: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue);
          const filterDate = new Date(filterLocalDateAtMidnight);
          return cellDate.getTime() - filterDate.getTime();
        }
      }
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 130,
      cellRenderer: StatusCellRenderer,
      sortable: true,
      filter: true,
      filterParams: {
        filterOptions: ['equals', 'notEqual'],
        defaultOption: 'equals'
      }
    },
    {
      field: 'amount',
      headerName: 'Monto (USD)',
      width: 140,
      cellRenderer: AmountCellRenderer,
      cellClass: 'text-right font-medium',
      comparator: (valueA, valueB) => parseFloat(valueA || 0) - parseFloat(valueB || 0),
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        filterOptions: ['equals', 'lessThan', 'greaterThan', 'inRange'],
        defaultOption: 'equals'
      }
    },
    {
      headerName: 'Acciones',
      field: 'actions',
      width: 180,
      pinned: 'right',
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onView: handleView,
        onPay: handlePay,
        payingInvoiceId
      },
      cellClass: 'text-center',
      sortable: false,
      filter: false,
      suppressMenu: true,
      resizable: false
    }
  ], [handleView, handlePay, payingInvoiceId]);

  // Optimized default column properties
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    minWidth: 100,
    suppressMenu: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    floatingFilter: false,
    suppressMovable: false,
    lockPosition: false,
    suppressKeyboardEvent: (params) => {
      // Allow keyboard navigation
      return false;
    }
  }), []);

  // Optimized grid options for performance
  const gridOptions = useMemo(() => ({
    // Performance optimizations
    rowBuffer: 10,
    suppressAnimationFrame: false,
    suppressBrowserResizeObserver: false,
    suppressColumnVirtualisation: false,
    suppressRowVirtualisation: false,
    
    // Selection and interaction
    rowSelection: 'single',
    suppressRowClickSelection: false,
    suppressCellFocus: false,
    
    // Row configuration
    rowHeight: 50,
    headerHeight: 50,
    animateRows: true,
    
    // Pagination
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [10, 20, 50, 100],
    paginationAutoPageSize: false,
    
    // Text selection and menus
    enableCellTextSelection: true,
    suppressMenuHide: false,
    allowContextMenuWithControlKey: true,
    
    // Performance settings
    suppressRowTransform: false,
    suppressColumnMoveAnimation: false,
    suppressRowHoverHighlight: false,
    
    // Accessibility
    enableRangeSelection: false,
    suppressCopyRowsToClipboard: true,
    suppressCopySingleCellRanges: false,
    
    // Event handlers
    onGridReady: (params) => {
      params.api.sizeColumnsToFit();
      gridRef.current = params.api;
    },
    onFirstDataRendered: (params) => {
      params.api.sizeColumnsToFit();
    },
    onColumnResized: (params) => {
      // Auto-fit columns when resized
      if (params.finished) {
        params.api.sizeColumnsToFit();
      }
    }
  }), []);

  // Optimized event handlers
  const onSelectionChanged = useCallback((event) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      console.log('Selected invoice:', selectedRows[0]);
    }
  }, []);

  const onFilterChanged = useCallback((event) => {
    const filteredRowCount = event.api.getDisplayedRowCount();
    console.log(`Filtered to ${filteredRowCount} rows`);
  }, []);

  const onSortChanged = useCallback((event) => {
    const sortModel = event.api.getSortModel();
    console.log('Sort changed:', sortModel);
  }, []);

  // Optimized mobile card component
  const MobileInvoiceCards = useMemo(() => (
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
            <StatusCellRenderer value={invoice.status} />
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
            <ActionsCellRenderer 
              data={invoice} 
              onView={handleView} 
              onPay={handlePay} 
              payingInvoiceId={payingInvoiceId} 
            />
          </div>
        </div>
      ))}
    </div>
  ), [filteredInvoices, handleView, handlePay, payingInvoiceId]);

  // Optimized statistics calculation
  const statistics = useMemo(() => {
    const paidCount = filteredInvoices.filter(invoice => invoice.status === InvoiceStatus.PAID).length;
    const pendingCount = filteredInvoices.filter(invoice => invoice.status === InvoiceStatus.PENDING).length;
    const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    
    return {
      total: filteredInvoices.length,
      paid: paidCount,
      pending: pendingCount,
      totalAmount
    };
  }, [filteredInvoices]);

  return (
    <div className="w-full h-full">
      {/* Table Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Facturas
          </h3>
          <p className="text-sm text-gray-600">
            {statistics.total} facturas encontradas
          </p>
        </div>
        
        <div className="text-xs text-gray-500 md:hidden">
          📱 Vista móvil
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="text-center">
          <div className="font-semibold text-gray-900">Total Facturas</div>
          <div className="text-gray-600">{statistics.total}</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-600">Pagadas</div>
          <div className="text-gray-600">{statistics.paid}</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-yellow-600">Pendientes</div>
          <div className="text-gray-600">{statistics.pending}</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-600">Monto Total</div>
          <div className="text-gray-600">
            ${statistics.totalAmount.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
        </div>
      </div>

      {/* Table Content */}
      {isMobile ? (
        MobileInvoiceCards
      ) : (
        <div className="ag-theme-alpine w-full h-96">
          <AgGridReact
            ref={gridRef}
            rowData={filteredInvoices}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            onSelectionChanged={onSelectionChanged}
            onFilterChanged={onFilterChanged}
            onSortChanged={onSortChanged}
            domLayout="normal"
            suppressRowClickSelection={false}
            enableCellTextSelection={true}
            suppressCopyRowsToClipboard={true}
            suppressCopySingleCellRanges={false}
            allowContextMenuWithControlKey={true}
            suppressMenuHide={false}
            suppressRowHoverHighlight={false}
            suppressColumnMoveAnimation={false}
            suppressRowTransform={false}
            suppressColumnVirtualisation={false}
            suppressRowVirtualisation={false}
            suppressBrowserResizeObserver={false}
            suppressAnimationFrame={false}
            rowBuffer={10}
          />
        </div>
      )}

    </div>
  );
});

export default InvoiceTable;