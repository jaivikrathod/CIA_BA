import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilShieldAlt } from '@coreui/icons'

import { AppSidebarNav } from './AppSidebarNav'
import geNavItems from '../_nav'
import { getInitials } from './header/AppHeaderDropdown'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const username = useSelector((state) => state.username)
  const adminType = useSelector((state) => state.adminType)
  const navigation = geNavItems(adminType) 

  return (
    <CSidebar
      className="app-sidebar"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader>
        <div className="app-brand">
          <span className="app-brand-mark">
            <CIcon icon={cilShieldAlt} height={20} />
          </span>
          <div className="app-brand-text">
            <div className="app-brand-name">Care Insurance</div>
            <div className="app-brand-sub">Agency Admin</div>
          </div>
        </div>

        <CCloseButton
          className="d-lg-none"
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="d-none d-lg-flex">
        <div className="app-user-card">
          <span className="app-avatar">{getInitials(username)}</span>
          <div className="app-user-text" style={{ minWidth: 0 }}>
            <div className="app-user-name">{username}</div>
            <div className="app-user-role">{adminType}</div>
          </div>
        </div>
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
