import React from 'react'
import InsuranceManagement2 from './views/InsuranceManagement/InsuranceManagement2'
import InsuranceCompanyManagement from './views/InsuranceManagement/InsuranceCompanyManagement'
import AgentCodeManagement from './views/Agent/AgentCodeManagement'

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
const pendingInsuranceManagement = React.lazy(()=> import("./views/InsuranceManagement/PendingInsuranceManagement"));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/customers', name: 'Customers', element: CustomerManagement },
  { path: '/users', name: 'Users', element: UserManagement },
  { path: '/edit-profile', name: 'Profile', element: EditProfile },
  { path: '/insurance', name: 'Insurance', element: InsuranceManagement2 },
  { path: '/pending-insurance-amount', name: 'Set Insurance Amount', element: pendingInsuranceManagement},
  { path: '/insurance-initial/:id',  element: InsuranceInitialDetails },
  { path: '/common-insurance1/:id',  element: InsuranceCommonDetails1 },
  { path: '/common-insurance2/:id/:common_id',  element: InsuranceCommonDetails2 },
  { path: '/insurance-detail/:id', element: InsuranceDetailMain },
  { path: '/upload-insurance-document/:id', element: uploadInsuranceDocument },
  
  { path: '/agent', name: 'Agents', element: AgentManagement },
  { path: '/agent-codes', name: 'Agents Code', element: AgentCodeManagement },

  { path: '/vehicle-company', name: 'Vehicle Make', element: vehicleCompany },
  { path: '/vehicle-models', name: 'Vehicle Models', element: vehicleModel },
  { path: '/insurance-companies', name: 'Insurance Company', element:InsuranceCompanyManagement },
]

export default routes
