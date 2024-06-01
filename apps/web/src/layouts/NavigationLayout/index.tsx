import { RouterObject } from '@web/core/router'
import { useDesignSystem } from '@web/designSystem'
import { Model } from '@web/domain'
import { useAuthentication } from '@web/modules/authentication'
import { Col, Layout, Row } from 'antd'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { Leftbar } from './components/Leftbar'
import { Logo } from './components/Logo'
import { SubNavigation } from './components/SubNavigation'
import { Topbar } from './components/Topbar/index.layout'

interface Props {
  children: ReactNode
}

export const NavigationLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter()

  const authentication = useAuthentication()
  const user = authentication?.user as Model.User

  const { isMobile } = useDesignSystem()

  const goTo = (url: string) => {
    router.push(url)
  }

  const goToUserPage = (url: string) => {
    router.push(url.replace(':id', user?.id))
  }

  let itemsLeftbar = []

  let itemsUser = []

  let itemsTopbar = [
    {
      key: '/home',
      label: 'Home',
      onClick: () => goTo('/home'),
    },

    {
      key: '/my-queues',
      label: 'My Queue',
      onClick: () => goTo('/my-queues'),
    },

    {
      key: '/favorites',
      label: 'Favorites',
      onClick: () => goTo('/favorites'),
    },

    {
      key: '/queues/create',
      label: 'Create Queue',
      onClick: () => goTo('/queues/create'),
    },

    {
      key: '/queue-dashboard',
      label: 'Queue Dashboard',
      onClick: () => goTo('/queue-dashboard'),
    },

    {
      key: '/queue-analytics',
      label: 'Queue Analytics',
      onClick: () => goTo('/queue-analytics'),
    },

    {
      key: '/feedback',
      label: 'Feedback',
      onClick: () => goTo('/feedback'),
    },
  ]

  let itemsSubNavigation = [
    {
      key: '/home',
      label: 'Home',
    },

    {
      key: '/queues/:queueId',
      label: 'Queue Details',
    },

    {
      key: '/my-queues',
      label: 'My Queue',
    },

    {
      key: '/favorites',
      label: 'Favorites',
    },

    {
      key: '/queues/:queueId/manage',
      label: 'Manage Queue',
    },

    {
      key: '/queues/create',
      label: 'Create Queue',
    },

    {
      key: '/queues/:queueId/edit',
      label: 'Edit Queue',
    },

    {
      key: '/queue-dashboard',
      label: 'Queue Dashboard',
    },

    {
      key: '/queue-analytics',
      label: 'Queue Analytics',
    },

    {
      key: '/queues/:queueId/bookings',
      label: 'Bookings',
    },

    {
      key: '/feedback',
      label: 'Feedback',
    },

    {
      key: '/queues/:queueId/reviews',
      label: 'Reviews',
    },
  ]

  let itemsMobile = [
    {
      key: 'profile',
      label: 'Profile',
      onClick: () => goTo(RouterObject.route.PROFILE),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      onClick: () => goTo(RouterObject.route.NOTIFICATIONS),
    },
    ...itemsTopbar,
    ...itemsLeftbar,
  ]

  const isLeftbar =
    (itemsLeftbar.length > 0 || itemsUser.length > 0) &&
    !isMobile &&
    authentication.isLoggedIn

  if (!authentication.isLoggedIn) {
    itemsLeftbar = []
    itemsUser = []
    itemsTopbar = []
    itemsSubNavigation = []
    itemsMobile = []
  }

  return (
    <>
      <Layout>
        <Row
          style={{
            height: '100vh',
            width: '100vw',
          }}
        >
          {isLeftbar && (
            <Col>
              <Leftbar
                items={itemsLeftbar}
                itemsUser={itemsUser}
                logo={<Logo className="m-2" />}
              />
            </Col>
          )}

          <Col
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Topbar
              isMobile={isMobile}
              isLoggedIn={authentication.isLoggedIn}
              items={itemsTopbar}
              itemsMobile={itemsMobile}
              logo={!isLeftbar && <Logo width={40} height={40} />}
            />

            <Col
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <SubNavigation items={itemsSubNavigation} />

              {children}
            </Col>
          </Col>
        </Row>
      </Layout>
    </>
  )
}
