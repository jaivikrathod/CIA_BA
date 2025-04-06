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
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from '../assets/brand/logo.svg'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

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
          <div className="">
            <img
              src="https://ui-avatars.com/api/?name=Mihir+Rathod&background=random&bold=true"
              alt="Admin Avatar"
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div className="text-end">
              <div className="fw-semibold " style={{ fontSize: '0.95rem' }}>Mihir Rathod</div>
              <div className="badge bg-primary text-white" style={{ fontSize: '0.65rem' }}>Admin</div>
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
