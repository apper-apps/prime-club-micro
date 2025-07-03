import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Pipeline from '@/components/pages/Pipeline'
import Calendar from '@/components/pages/Calendar'
import Leaderboard from '@/components/pages/Leaderboard'
import Leads from '@/components/pages/Leads'
function App() {
  return (
<BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
        <Layout>
<Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/leads" element={<Leads />} />
          </Routes>
        </Layout>
<ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="backdrop-blur-sm"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App