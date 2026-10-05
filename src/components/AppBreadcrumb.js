import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  // Parameterised pages (e.g. /insurance-detail/12) have no exact route match
  const detailPageNames = {
    'insurance-initial': 'New Insurance',
    'common-insurance1': 'Vehicle Details',
    'common-insurance2': 'Insurance Details',
    'insurance-detail': 'Insurance Details',
    'upload-insurance-document': 'Insurance Documents',
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)
  const detailPageName = detailPageNames[currentLocation.split('/')[1]]
  if (breadcrumbs.length === 0 && detailPageName) {
    breadcrumbs.push({ pathname: currentLocation, name: detailPageName, active: true })
  }

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
