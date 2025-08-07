import React from 'react'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './App.css'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import InvoiceDashboard from './components/InvoiceDashboard.jsx'

// Register AG Grid modules globally - FIXED ERROR #272
ModuleRegistry.registerModules([AllCommunityModule])

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <InvoiceDashboard />
    </div>
  )
}

export default App
