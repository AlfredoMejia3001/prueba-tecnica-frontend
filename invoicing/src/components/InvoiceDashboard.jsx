import React, { useEffect, useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CButtonGroup
} from '@coreui/react';
import { cilPlus, cilCloudDownload, cilDescription } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useInvoiceStore, useInvoiceStats } from '../stores/invoiceStore.js';
import InvoiceTable from './InvoiceTable.jsx';
import InvoiceFilters from './InvoiceFilters.jsx';
import InvoiceModal from './InvoiceModal.jsx';
import GlobalSearch from './GlobalSearch.jsx';
import { useToast } from './NotificationToast.jsx';

const InvoiceDashboard = () => {
  const { openModal, initialize } = useInvoiceStore();
  const stats = useInvoiceStats();
  const toast = useToast();
  const [statsAnimation, setStatsAnimation] = useState('');

  useEffect(() => {
    initialize();
    
    // Listen for invoice events
    const handleInvoiceAdded = (event) => {
      const { invoice } = event.detail;
      toast.success(`¡Factura ${invoice.invoiceNumber} creada exitosamente!`);
      triggerStatsAnimation();
    };

    const handleInvoiceUpdated = (event) => {
      const { type, invoice } = event.detail;
      if (type === 'payment') {
        toast.success(`¡Factura ${invoice.invoiceNumber} marcada como pagada!`);
        triggerStatsAnimation();
      }
    };
    
    window.addEventListener('invoice-added', handleInvoiceAdded);
    window.addEventListener('invoice-updated', handleInvoiceUpdated);
    
    return () => {
      window.removeEventListener('invoice-added', handleInvoiceAdded);
      window.removeEventListener('invoice-updated', handleInvoiceUpdated);
    };
  }, []); // Empty dependencies to run only once

  const triggerStatsAnimation = () => {
    setStatsAnimation('animate-stats-update');
    setTimeout(() => setStatsAnimation(''), 400);
  };

  const handleNewInvoice = () => {
    // Add button animation
    const button = document.getElementById('new-invoice-btn');
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => button.classList.remove('animate-pulse'), 300);
    }
    openModal();
  };

  const handleExportCSV = () => {
    try {
      const { filteredInvoices } = useInvoiceStore.getState();
      
      if (filteredInvoices.length === 0) {
        toast.warning('No hay facturas para exportar');
        return;
      }
      
      // Create CSV content
      const headers = ['Número de Factura', 'Cliente', 'Fecha', 'Estado', 'Monto (USD)'];
      const csvContent = [
        headers.join(','),
        ...filteredInvoices.map(invoice => [
          invoice.invoiceNumber,
          `"${invoice.customerName}"`,
          invoice.date,
          invoice.status,
          invoice.amount
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `facturas_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exportadas ${filteredInvoices.length} facturas exitosamente`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Error al exportar el archivo CSV');
    }
  };

  const handleImportCSV = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const csv = event.target.result;
            const lines = csv.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',');
            
            if (lines.length <= 1) {
              toast.warning('El archivo CSV está vacío');
              return;
            }
            
            // Simple CSV parsing (for demonstration)
            console.log('CSV imported successfully:', { headers, rows: lines.length - 1 });
            toast.success(`CSV importado exitosamente!\n${lines.length - 1} filas procesadas`);
          } catch (error) {
            console.error('Error parsing CSV:', error);
            toast.error('Error al procesar el archivo CSV');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <CContainer fluid className="py-4">
      {/* Header Section */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
            <div className="flex-grow-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                📊 Módulo de Facturación
              </h1>
              <p className="text-sm md:text-base text-gray-600 mb-3">
                Departamento de Contabilidad - CustomsCity
              </p>
              {/* Global Search */}
              <div className="d-block d-lg-none mb-3">
                <GlobalSearch className="w-100" />
              </div>
            </div>
            
            {/* Desktop Search */}
            <div className="d-none d-lg-block me-3" style={{ minWidth: '300px' }}>
              <GlobalSearch />
            </div>
            <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-lg-auto">
              <CButton
                color="info"
                variant="outline"
                onClick={handleImportCSV}
                size="sm"
                className="w-100 w-sm-auto"
              >
                <CIcon icon={cilCloudDownload} size="sm" className="me-1" />
                <span className="d-none d-md-inline">Importar </span>CSV
              </CButton>
              <CButton
                color="secondary"
                variant="outline"
                onClick={handleExportCSV}
                size="sm"
                className="w-100 w-sm-auto"
              >
                <CIcon icon={cilDescription} size="sm" className="me-1" />
                <span className="d-none d-md-inline">Exportar</span>
              </CButton>
              <CButton
                id="new-invoice-btn"
                color="primary"
                onClick={handleNewInvoice}
                size="sm"
                className="w-100 w-sm-auto fw-bold hover-lift transition-all duration-200 hover:scale-105"
              >
                <CIcon icon={cilPlus} size="sm" className="me-1" />
                Nueva Factura
              </CButton>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Stats Cards */}
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3}>
          <CCard className={`border-0 shadow-sm h-100 transition-all duration-300 hover-lift ${statsAnimation}`}>
            <CCardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Facturas</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className={`border-0 shadow-sm h-100 transition-all duration-300 hover-lift ${statsAnimation}`}>
            <CCardBody className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats.paid}
              </div>
              <div className="text-sm text-gray-600">Pagadas</div>
              <div className="text-xs text-green-600 font-medium">
                ${stats.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className={`border-0 shadow-sm h-100 transition-all duration-300 hover-lift ${statsAnimation}`}>
            <CCardBody className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
              <div className="text-xs text-yellow-600 font-medium">
                ${stats.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className={`border-0 shadow-sm h-100 transition-all duration-300 hover-lift ${statsAnimation}`}>
            <CCardBody className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                ${stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600">Monto Total</div>
              <div className="text-xs text-gray-500">
                {((stats.paidAmount / stats.totalAmount) * 100 || 0).toFixed(1)}% cobrado
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Filters Section */}
      <CRow className="mb-4">
        <CCol>
          <InvoiceFilters />
        </CCol>
      </CRow>

      {/* Main Table Section */}
      <CRow>
        <CCol>
          <CCard className="border-0 shadow-sm">
            <CCardHeader className="bg-white border-bottom-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 font-semibold text-gray-900">
                  Facturas Registradas
                </h5>
                <div className="text-sm text-gray-600">
                  Última actualización: {new Date().toLocaleString('es-ES')}
                </div>
              </div>
            </CCardHeader>
            <CCardBody className="p-0">
              <InvoiceTable />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal for Adding/Editing Invoices */}
      <InvoiceModal />
      
      {/* Toast Notifications */}
      <toast.ToastContainer />
    </CContainer>
  );
};

export default InvoiceDashboard;