import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,           
  cilGroup,       
  cilShieldAlt,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
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
    icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{height:'20px'}} />,
  },{
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" style={{height:'20px'}} />,
  },{
    component: CNavItem,
    name: 'Insurance',
    to: '/insurance',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" style={{height:'20px'}} />,
  }
]

export default _nav
