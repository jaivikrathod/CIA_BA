import React from 'react'
import { Link } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useSelector } from 'react-redux'
const AppHeaderDropdown = () => {
  const username = useSelector((state) => state.username)

  const logout = () => {  
    localStorage.clear();
    window.location.href = "/";
    location.reload();
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
         <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&bold=true`}
            alt="Admin Avatar"
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginTop: '3px',
              }}
            />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <Link to="/edit-profile" style={{ textDecoration: 'none' }}>
        <CDropdownItem>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        </Link>
        <CDropdownItem onClick={()=> logout()}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
