'use client'

import { useEffect, useState } from 'react'
import {
  Typography,
  Carousel,
  Button,
  Spin,
  Row,
  Col,
  Card,
} from 'antd'
import {
  CheckCircleOutlined,
} from '@ant-design/icons'
const { Title, Paragraph } = Typography
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function ManageQueuePage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()
  const [queue, setQueue] = useState<Model.Queue | null>(null)
  const [participants, setParticipants] = useState<Model.Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const queueData = await Api.Queue.findManyByServiceProviderId(userId, {
          includes: ['participants', 'participants.user'],
        })
        if (queueData.length > 0) {
          setQueue(queueData[0])
          setParticipants(queueData[0].participants || [])
          setLocation(queueData[0].location)
        }
      } catch (error) {
        enqueueSnackbar('Failed to load queue data', { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    fetchQueueData()
  }, [userId])

  const handlePauseResumeQueue = async () => {
    if (!queue) return
    try {
      const updatedQueue = await Api.Queue.updateOne(queue.id, {})
      setQueue(updatedQueue)
      enqueueSnackbar(
        `Queue ${updatedQueue.status === 'active' ? 'resumed' : 'paused'} successfully`,
        { variant: 'success' },
      )
    } catch (error) {
      enqueueSnackbar('Failed to update queue status', { variant: 'error' })
    }
  }

  const handleMarkServed = async (participantId: string) => {
    try {
      await Api.Participant.deleteOne(participantId)
      setParticipants(prev =>
        prev.filter(p => p.id !== participantId),
      )
      if (queue) {
        setQueue(prevQueue => ({
          ...prevQueue,
          participants: prevQueue?.participants?.filter(p => p.id !== participantId),
        }))
      }
      enqueueSnackbar('Participant marked as served', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to mark participant as served', {
        variant: 'error',
      })
    }
  }

  return (
    <PageLayout layout="narrow">
      <Row justify="center">
        <Col xs={24} md={18} lg={12}>
          <Card>
            <Title level={2}>Manage Queue</Title>
            <Paragraph>
              As a Service Provider, you can manage queues, including pausing or
              resuming the queue and viewing participant details. You can also
              mark users as served.
            </Paragraph>
            {loading ? (
              <Spin size="large" />
            ) : (
              <>
                <Button
                  type="primary"
                  onClick={handlePauseResumeQueue}
                  style={{ marginBottom: 16 }}
                >
                  {queue?.status === 'active' ? 'Pause Queue' : 'Resume Queue'}
                </Button>
                <Paragraph>
                  <strong>Queue Name:</strong> {queue?.name} <br />
                  <strong>Location:</strong> {location}
                </Paragraph>
                <Carousel>
                  {participants?.map(participant => (
                    <Card key={participant.id} style={{ margin: '0 10px' }}>
                      <Title level={4}>{participant.user?.name}</Title>
                      <Paragraph>
                        <strong>Position:</strong> {participant.position} <br />
                        <strong>Join Time:</strong> {dayjs(participant.joinTime).format('YYYY-MM-DD HH:mm')}
                      </Paragraph>
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleMarkServed(participant.id)}
                      >
                        Mark as Served
                      </Button>
                    </Card>
                  ))}
                </Carousel>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
