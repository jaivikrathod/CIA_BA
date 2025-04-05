import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import PrivateRoute from '../PrivateRoute'

const DefaultLayout = () => {
  return (
    <PrivateRoute>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>
    </PrivateRoute>

  )
}

export default DefaultLayout
