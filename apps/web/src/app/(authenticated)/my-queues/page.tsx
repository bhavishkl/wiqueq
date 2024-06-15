'use client'

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'
import { useAuthentication } from '@web/modules/authentication'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
const { Title, Text } = Typography

export default function MyQueuePage() {
  const router = useRouter()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [user, setUser] = useState<Model.User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      console.log('Fetching user data...')
      Api.User.findOne(userId, {
        includes: ['participants.queue', 'bookings.queue'],
      })
        .then(user => {
          console.log('User data:', user)
          setUser(user)
        })
        .catch(error => {
          console.error('Failed to load user data:', error)
          enqueueSnackbar('Failed to load user data', { variant: 'error' })
        })
        .finally(() => setLoading(false))
    }
  }, [userId])

  const handleLeaveQueue = (participantId: string) => {
    console.log('Leaving queue for participant:', participantId)
    Api.Participant.remove(participantId)
      .then(() => {
        enqueueSnackbar('Left the queue successfully', { variant: 'success' })
        setUser(prevUser => ({
          ...prevUser,
          participants: prevUser.participants.filter(p => p.id !== participantId),
        }))
      })
      .catch(error => {
        console.error('Failed to leave the queue:', error)
        enqueueSnackbar('Failed to leave the queue', { variant: 'error' })
      })
  }

  const handleCancelBooking = (bookingId: string) => {
    console.log('Cancelling booking:', bookingId)
    Api.Booking.remove(bookingId)
      .then(() => {
        enqueueSnackbar('Booking cancelled successfully', { variant: 'success' })
        setUser(prevUser => ({
          ...prevUser,
          bookings: prevUser.bookings.filter(b => b.id !== bookingId),
        }))
      })
      .catch(error => {
        console.error('Failed to cancel booking:', error)
        enqueueSnackbar('Failed to cancel booking', { variant: 'error' })
      })
  }

  const calculateEstimatedWaitTime = (queue: Model.Queue, position: number) => {
    if (!queue.averageTime) return 'N/A'
    const [hours, minutes] = queue.averageTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes
    const estimatedWaitTime = dayjs().add(totalMinutes * position, 'minute')
    return estimatedWaitTime.format('hh:mm A') // 12-hour format with AM/PM
  }

  if (loading) {
    return (
      <PageLayout layout="narrow">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </PageLayout>
    )
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>My Queues and Bookings</Title>
      <Text>Here you can see your current and past queues and bookings.</Text>

      <Title level={3}>Current Queues</Title>
      <Row gutter={[16, 16]}>
        {user?.participants?.map(participant => (
          <Col span={24} key={participant.id}>
            <Card>
              <Row>
                <Col span={4}>
                  <img
                    src={participant.queue?.logoUrl}
                    alt={participant.queue?.name}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={20}>
                  <Title level={4}>{participant.queue?.name}</Title>
                  <Text>Position: {participant.position ?? 'N/A'}</Text>
                  <br />
                  <Text>
                    Estimated Wait Time: {calculateEstimatedWaitTime(participant.queue, participant.position)}
                  </Text>
                  <br />
                  <Space>
                    <Button
                      type="primary"
                      onClick={() =>
                        router.push(`/queues/${participant.queue?.id}`)
                      }
                    >
                      Details
                    </Button>
                    <Button
                      danger
                      onClick={() => handleLeaveQueue(participant.id)}
                    >
                      Leave Queue
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3}>Current Bookings</Title>
      <Row gutter={[16, 16]}>
        {user?.bookings?.map(booking => (
          <Col span={24} key={booking.id}>
            <Card>
              <Row>
                <Col span={4}>
                  <img
                    src={booking.queue?.logoUrl}
                    alt={booking.queue?.name}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={20}>
                  <Title level={4}>{booking.queue?.name}</Title>
                  <Text>
                    Booking Time:{' '}
                    {dayjs(booking.bookingTime).format('YYYY-MM-DD HH:mm')}
                  </Text>
                  <br />
                  <Text>Service: {booking.service}</Text>
                  <br />
                  <Space>
                    <Button
                      type="primary"
                      onClick={() =>
                        router.push(`/queues/${booking.queue?.id}`)
                      }
                    >
                      Details
                    </Button>
                    <Button
                      danger
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3}>Past Queues</Title>
      <Row gutter={[16, 16]}>
        {user?.participants
          ?.filter(participant => participant.status === 'completed')
          .map(participant => (
            <Col span={24} key={participant.id}>
              <Card>
                <Row>
                  <Col span={4}>
                    <img
                      src={participant.queue?.logoUrl}
                      alt={participant.queue?.name}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={20}>
                    <Title level={4}>{participant.queue?.name}</Title>
                    <Text>
                      Join Time:{' '}
                      {dayjs(participant.joinTime).format('YYYY-MM-DD HH:mm')}
                    </Text>
                    <br />
                    <Text>
                      Status:{' '}
                      {participant.status === 'served' ? (
                        <CheckCircleOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: 'red' }} />
                      )}
                    </Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
      </Row>

      <Title level={3}>Past Bookings</Title>
      <Row gutter={[16, 16]}>
        {user?.bookings
          ?.filter(booking => booking.status === 'completed')
          .map(booking => (
            <Col span={24} key={booking.id}>
              <Card>
                <Row>
                  <Col span={4}>
                    <img
                      src={booking.queue?.logoUrl}
                      alt={booking.queue?.name}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={20}>
                    <Title level={4}>{booking.queue?.name}</Title>
                    <Text>
                      Booking Time:{' '}
                      {dayjs(booking.bookingTime).format('YYYY-MM-DD HH:mm')}
                    </Text>
                    <br />
                    <Text>Service: {booking.service}</Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
      </Row>
    </PageLayout>
  )
}
