import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,
  cilGroup,
  cilShieldAlt,
  cilContact,
  cilTruck
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = (admintype) => {

  return [

    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      // badge: {
      //   color: 'info',
      //   text: 'NEW',
      // },
    },
    {
      component: CNavItem,
      name: 'Customers',
      to: '/customers',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{ height: '20px' }} />,
    }, admintype === 'Admin' ? {
      component: CNavItem,
      name: 'Users',
      to: '/users',
      icon: <CIcon icon={cilGroup} customClassName="nav-icon" style={{ height: '20px' }} />,
    }:null,
     {
      component: CNavItem,
      name: 'Insurance',
      to: '/insurance',
      icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" style={{ height: '20px' }} />,
    },{
      component: CNavItem,
      name: 'Agents',
      to: '/agent',
      icon: <CIcon icon={cilContact} customClassName="nav-icon" style={{ height: '20px' }} />,
    },{
      component: CNavItem,
      name: 'vehicle',
      to: '/vehicle',
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" style={{ height: '20px' }} />,
    }
  ].filter(Boolean)
}

export default _nav
