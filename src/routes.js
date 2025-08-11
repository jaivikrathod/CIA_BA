import React from 'react'
import InsuranceManagement2 from './views/InsuranceManagement/InsuranceManagement2'
import InsuranceCompanyManagement from './views/InsuranceManagement/InsuranceCompanyManagement'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CustomerManagement = React.lazy(() => import('./views/CustomerManagement/CustomerManagement'))
const UserManagement = React.lazy(() => import('./views/UserManagement/UserManagement'))
const InsuranceInitialDetails = React.lazy(() => import('./views/InsuranceManagement/InitialInsurance'))
const InsuranceCommonDetails1 = React.lazy(() => import('./views/InsuranceManagement/InsuranceCommonDetails1'))
const InsuranceCommonDetails2 = React.lazy(() => import('./views/InsuranceManagement/InsuranceCommonDetails2'))
const InsuranceDetailMain = React.lazy(() => import('./views/InsuranceManagement/InsuranceDetailMain'))
const uploadInsuranceDocument = React.lazy(()=>import('./views/InsuranceManagement/uploadInsuranceDoc'));
const AgentManagement = React.lazy(() => import('./views/Agent/AgentManagement'))
const EditProfile = React.lazy(()=>import('./views/UserManagement/EditProfile'))
const vehicleCompany = React.lazy(()=> import('./views/Vehicle/VehicleCompanyManagement'))
const vehicleModel = React.lazy(()=> import('./views/Vehicle/VehicleModelManagement'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/customers', name: 'customers', element: CustomerManagement },
  { path: '/users', name: 'users', element: UserManagement },
  { path: '/edit-profile', name: 'editprofile', element: EditProfile },
  { path: '/insurance', name: 'insurance', element: InsuranceManagement2 },
  { path: '/insurance-initial/:id',  element: InsuranceInitialDetails },
  { path: '/common-insurance1/:id',  element: InsuranceCommonDetails1 },
  { path: '/common-insurance2/:id/:common_id',  element: InsuranceCommonDetails2 },
  { path: '/insurance-detail/:id', element: InsuranceDetailMain },
  { path: '/upload-insurance-document/:id', element: uploadInsuranceDocument },
  
  { path: '/agent', name: 'agent', element: AgentManagement },
  { path: '/vehicle-company', name: 'vehicle', element: vehicleCompany },
  { path: '/vehicle-models', name: 'vehicle', element: vehicleModel },
  { path: '/insurance-companies', name: 'insuranceCompanies', element:InsuranceCompanyManagement },
]

export default routes
