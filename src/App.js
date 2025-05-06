import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useColorModes } from '@coreui/react'
import LoadingComponent from './components/common/LoadingComponent'
import './scss/style.scss'
// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

const ChangePass = React.lazy(() => import('./views/pages/login/changePass'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <LoadingComponent />
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />

          <Route exact path="/change-password/:id" name="change password" element={<ChangePass />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />

        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
