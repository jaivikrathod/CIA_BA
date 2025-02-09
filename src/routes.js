import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CustomerManagement = React.lazy(() => import('./views/CustomerManagement/CustomerManagement'))
const UserManagement = React.lazy(() => import('./views/UserManagement/UserManagement'))
const InsuranceManagement = React.lazy(() => import('./views/InsuranceManagement/InsuranceManagement'))
const InsuranceInitialDetails = React.lazy(() => import('./views/InsuranceManagement/InitialInsurance'))
const InsuranceCommonDetails1 = React.lazy(() => import('./views/InsuranceManagement/InsuranceCommonDetails1'))
const InsuranceCommonDetails2 = React.lazy(() => import('./views/InsuranceManagement/InsuranceCommonDetails2'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/customers', name: 'customers', element: CustomerManagement },
  { path: '/users', name: 'users', element: UserManagement },
  { path: '/insurance', name: 'insurance', element: InsuranceManagement },
  { path: '/insurance-initial', name: 'insuranceInitial', element: InsuranceInitialDetails },
  { path: '/common-insurance1/:id', name: 'insuranceInitial', element: InsuranceCommonDetails1 },
  { path: '/common-insurance2/:id', name: 'insuranceInitial', element: InsuranceCommonDetails2 },
]

export default routes
