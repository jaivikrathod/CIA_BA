import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import geNavItems from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const username = useSelector((state) => state.username)
  const adminType = useSelector((state) => state.adminType)
  const navigation = geNavItems(adminType) 

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom px-3 py-2  shadow-sm">
        <div style={{ display: 'flex', gap: '18px', margin: '20px 0px 10px 10px', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&bold=true`}
            alt="Admin Avatar"
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />

          <div >
            <div className="fw-semibold " style={{ fontSize: '0.95rem' }}>{username}</div>
            <div className="badge bg-primary text-white" style={{ fontSize: '10px' }}>{adminType}</div>
          </div>
        </div>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
