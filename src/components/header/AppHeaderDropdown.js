import React from 'react'
import { Link } from 'react-router-dom'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilAccountLogout, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useSelector } from 'react-redux'

export const getInitials = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('') || 'U'

const AppHeaderDropdown = () => {
  const username = useSelector((state) => state.username)
  const adminType = useSelector((state) => state.adminType)

  const logout = () => {  
    localStorage.clear();
    window.location.href = "/";
    location.reload();
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="app-user-toggle" caret={false}>
        <span className="app-avatar">{getInitials(username)}</span>
        <span className="d-none d-md-block text-start">
          <span className="app-user-name d-block">{username}</span>
          <span className="app-user-role d-block">{adminType}</span>
        </span>
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end">
        <Link to="/edit-profile" style={{ textDecoration: 'none' }}>
        <CDropdownItem>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        </Link>
        <CDropdownDivider />
        <CDropdownItem onClick={()=> logout()}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
