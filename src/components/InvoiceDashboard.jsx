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
import { InvoiceStatus } from '../types/invoice.js';
import InvoiceTable from './InvoiceTable.jsx';
import InvoiceFilters from './InvoiceFilters.jsx';
import InvoiceModal from './InvoiceModal.jsx';
import InvoiceSidebar from './InvoiceSidebar.jsx';
import GlobalSearch from './GlobalSearch.jsx';
import { useToast } from './NotificationToast.jsx';

const InvoiceDashboard = () => {
  const { 
    openModal, 
    initialize, 
    importInvoicesFromCSV,
    selectedInvoice,
    isInvoiceDetailOpen,
    closeInvoiceDetail,
    updateInvoice,
    setPayingInvoiceId,
    payingInvoiceId
  } = useInvoiceStore();
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

    const handleCSVImportCompleted = (event) => {
      const { results } = event.detail;
      const { successful, duplicates, errors } = results;

      // Show summary notification
      if (successful.length > 0) {
        toast.success(`✅ ${successful.length} facturas importadas exitosamente`);
        triggerStatsAnimation();
      }

      if (duplicates.length > 0) {
        toast.warning(`⚠️ ${duplicates.length} facturas duplicadas omitidas`);
      }

      if (errors.length > 0) {
        toast.error(`❌ ${errors.length} facturas con errores no se pudieron importar`);
      }

      // Show detailed results if there are issues
      if (duplicates.length > 0 || errors.length > 0) {
        setTimeout(() => {
          let detailMessage = '';
          
          if (duplicates.length > 0) {
            detailMessage += `\n📋 Facturas duplicadas (${duplicates.length}):\n`;
            duplicates.slice(0, 3).forEach(dup => {
              detailMessage += `• Fila ${dup.row}: ${dup.data.invoiceNumber || dup.data.customerName}\n`;
            });
            if (duplicates.length > 3) {
              detailMessage += `• ... y ${duplicates.length - 3} más\n`;
            }
          }

          if (errors.length > 0) {
            detailMessage += `\n❌ Errores encontrados (${errors.length}):\n`;
            errors.slice(0, 3).forEach(err => {
              detailMessage += `• Fila ${err.row}: ${err.reason}\n`;
            });
            if (errors.length > 3) {
              detailMessage += `• ... y ${errors.length - 3} más\n`;
            }
          }

          toast.info(`📊 Resumen de importación CSV:${detailMessage}`, { autoClose: 10000 });
        }, 1000);
      }
    };
    
    window.addEventListener('invoice-added', handleInvoiceAdded);
    window.addEventListener('invoice-updated', handleInvoiceUpdated);
    window.addEventListener('csv-import-completed', handleCSVImportCompleted);
    
    return () => {
      window.removeEventListener('invoice-added', handleInvoiceAdded);
      window.removeEventListener('invoice-updated', handleInvoiceUpdated);
      window.removeEventListener('csv-import-completed', handleCSVImportCompleted);
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

  const handleExportCSV = () => {
    try {
      const { filteredInvoices } = useInvoiceStore.getState();
      
      if (filteredInvoices.length === 0) {
        toast.warning('No hay facturas para exportar.');
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
      
      toast.success('Facturas exportadas exitosamente.');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Error al exportar las facturas.');
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
            
            if (lines.length <= 1) {
              toast.warning('El archivo CSV está vacío');
              return;
            }
            
            // Parse CSV headers
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            
            // Expected headers (flexible matching)
            const headerMap = {
              invoiceNumber: ['numero', 'numero de factura', 'invoice number', 'factura', 'invoicenumber'],
              customerName: ['cliente', 'customer', 'customer name', 'customername', 'nombre cliente'],
              date: ['fecha', 'date', 'fecha factura'],
              amount: ['monto', 'amount', 'total', 'valor'],
              status: ['estado', 'status', 'state']
            };

            // Map CSV headers to our fields
            const fieldMapping = {};
            Object.keys(headerMap).forEach(field => {
              const headerIndex = headers.findIndex(header => 
                headerMap[field].some(variant => 
                  header.toLowerCase().includes(variant.toLowerCase())
                )
              );
              if (headerIndex !== -1) {
                fieldMapping[field] = headerIndex;
              }
            });

            // Check if we have required fields
            const requiredFields = ['invoiceNumber', 'customerName', 'date', 'amount'];
            const missingFields = requiredFields.filter(field => fieldMapping[field] === undefined);
            
            if (missingFields.length > 0) {
              toast.error(`Faltan columnas requeridas en el CSV: ${missingFields.join(', ')}`);
              return;
            }

            // Parse data rows
            const csvInvoices = [];
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
              
              if (values.length < Math.max(...Object.values(fieldMapping)) + 1) {
                continue; // Skip incomplete rows
              }

              const invoiceData = {
                invoiceNumber: values[fieldMapping.invoiceNumber] || '',
                customerName: values[fieldMapping.customerName] || '',
                date: values[fieldMapping.date] || '',
                amount: values[fieldMapping.amount] || '',
                status: values[fieldMapping.status] || 'Pendiente'
              };

              // Normalize status
              const statusLower = invoiceData.status.toLowerCase();
              if (statusLower.includes('pagad') || statusLower.includes('paid')) {
                invoiceData.status = 'Pagada';
              } else {
                invoiceData.status = 'Pendiente';
              }

              csvInvoices.push(invoiceData);
            }

            if (csvInvoices.length === 0) {
              toast.warning('No se encontraron datos válidos en el CSV');
              return;
            }

            // Show loading notification
            toast.info(`🔄 Procesando ${csvInvoices.length} facturas del CSV...`);

            // Import invoices with validation
            importInvoicesFromCSV(csvInvoices);
            
          } catch (error) {
            console.error('Error parsing CSV:', error);
            toast.error(`Error al procesar el archivo CSV: ${error.message}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <CContainer fluid className="py-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <CRow className="mb-6">
        <CCol xs={12}>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-4">
            <div className="flex-grow-1">
              <div className="flex items-center mb-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl mr-4 shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                    Módulo de Facturación
                  </h1>
                  <p className="text-base md:text-lg text-gray-600 font-medium">
                    Departamento de Contabilidad - CustomsCity
                  </p>
                </div>
              </div>
              {/* Global Search */}
              <div className="d-block d-lg-none mb-4">
                <GlobalSearch className="w-100" />
              </div>
            </div>
            
            {/* Desktop Search */}
            <div className="d-none d-lg-block me-4" style={{ minWidth: '320px' }}>
              <GlobalSearch />
            </div>
            <div className="d-flex flex-column flex-sm-row gap-3 w-100 w-lg-auto">
              <CButton
                color="info"
                variant="outline"
                onClick={handleImportCSV}
                size="sm"
                className="w-100 w-sm-auto border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 font-semibold"
              >
                <CIcon icon={cilCloudDownload} size="sm" className="me-2" />
                <span className="d-none d-md-inline">Importar </span>CSV
              </CButton>
              <CButton
                color="secondary"
                variant="outline"
                onClick={handleExportCSV}
                size="sm"
                className="w-100 w-sm-auto border-2 hover:border-gray-500 hover:bg-gray-50 transition-all duration-300 font-semibold"
              >
                <CIcon icon={cilDescription} size="sm" className="me-2" />
                <span className="d-none d-md-inline">Exportar</span>
              </CButton>
              <CButton
                id="new-invoice-btn"
                color="primary"
                onClick={handleNewInvoice}
                size="sm"
                className="w-100 w-sm-auto fw-bold hover-lift transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg hover:shadow-xl"
              >
                <CIcon icon={cilPlus} size="sm" className="me-2" />
                Nueva Factura
              </CButton>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Stats Cards */}
      <CRow className="mb-6">
        <CCol xs={12} sm={6} lg={3}>
          <CCard className={`border-0 shadow-xl h-100 transition-all duration-500 hover-lift ${statsAnimation} bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <CCardBody className="text-center relative z-10">
              <div className="text-3xl font-bold mb-2">
                {stats.total}
              </div>
              <div className="text-blue-100 font-medium">Total Facturas</div>
              <div className="text-xs text-blue-200 mt-2 opacity-80">
                📋 Registradas
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className={`border-0 shadow-xl h-100 transition-all duration-500 hover-lift ${statsAnimation} bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <CCardBody className="text-center relative z-10">
              <div className="text-3xl font-bold mb-2">
                {stats.paid}
              </div>
              <div className="text-green-100 font-medium">Pagadas</div>
              <div className="text-xs text-green-200 mt-2 opacity-80">
                ${stats.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className={`border-0 shadow-xl h-100 transition-all duration-500 hover-lift ${statsAnimation} bg-gradient-to-br from-yellow-500 to-orange-600 text-white overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <CCardBody className="text-center relative z-10">
              <div className="text-3xl font-bold mb-2">
                {stats.pending}
              </div>
              <div className="text-yellow-100 font-medium">Pendientes</div>
              <div className="text-xs text-yellow-200 mt-2 opacity-80">
                ${stats.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className={`border-0 shadow-xl h-100 transition-all duration-500 hover-lift ${statsAnimation} bg-gradient-to-br from-purple-500 to-pink-600 text-white overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <CCardBody className="text-center relative z-10">
              <div className="text-2xl font-bold mb-2">
                ${stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-purple-100 font-medium">Monto Total</div>
              <div className="text-xs text-purple-200 mt-2 opacity-80">
                {((stats.paidAmount / stats.totalAmount) * 100 || 0).toFixed(1)}% cobrado
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Filters Section */}
      <CRow className="mb-6">
        <CCol>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <InvoiceFilters />
          </div>
        </CCol>
      </CRow>

      {/* Main Table Section */}
      <CRow>
        <CCol>
          <CCard className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CCardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-bottom-0 py-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="flex items-center">
                  <div className="bg-blue-600 p-2 rounded-lg mr-3">
                    <span className="text-white text-lg">📋</span>
                  </div>
                  <div>
                    <h5 className="mb-0 font-bold text-gray-900 text-lg">
                      Facturas Registradas
                    </h5>
                    <p className="text-sm text-gray-600 mb-0">
                      Gestión completa de facturas
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full">
                  <span className="font-medium">Última actualización:</span> {new Date().toLocaleString('es-ES')}
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
      
      {/* Invoice Detail Modal - Renders over entire dashboard */}
      <InvoiceSidebar
        invoice={selectedInvoice}
        isOpen={isInvoiceDetailOpen}
        onClose={closeInvoiceDetail}
        onPay={handlePay}
        payingInvoiceId={payingInvoiceId}
      />
      
      {/* Toast Notifications */}
      <toast.ToastContainer />
    </CContainer>
  );
};

export default InvoiceDashboard;