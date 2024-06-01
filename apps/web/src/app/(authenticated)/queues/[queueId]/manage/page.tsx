'use client'

import { useEffect, useState } from 'react'
import {
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Spin,
  Row,
  Col,
  Card,
} from 'antd'
import {
  PauseOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
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

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const queueData = await Api.Queue.findManyByServiceProviderId(userId, {
          includes: ['participants', 'participants.user'],
        })
        if (queueData.length > 0) {
          setQueue(queueData[0])
          setParticipants(queueData[0].participants || [])
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
      const updatedQueue = await Api.Queue.updateOne(queue.id, {
        status: queue.status === 'active' ? 'paused' : 'active',
      })
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
      const updatedParticipant = await Api.Participant.updateOne(
        participantId,
        { status: 'served' },
      )
      setParticipants(prev =>
        prev.map(p => (p.id === participantId ? updatedParticipant : p)),
      )
      enqueueSnackbar('Participant marked as served', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to mark participant as served', {
        variant: 'error',
      })
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: ['user', 'name'],
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: 'Join Time',
      dataIndex: 'joinTime',
      key: 'joinTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'served' ? 'green' : 'blue'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Model.Participant) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            disabled={record.status === 'served'}
            onClick={() => handleMarkServed(record.id)}
          >
            Mark as Served
          </Button>
        </Space>
      ),
    },
  ]

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
                  icon={
                    queue?.status === 'active' ? (
                      <PauseOutlined />
                    ) : (
                      <PlayCircleOutlined />
                    )
                  }
                  onClick={handlePauseResumeQueue}
                  style={{ marginBottom: 16 }}
                >
                  {queue?.status === 'active' ? 'Pause Queue' : 'Resume Queue'}
                </Button>
                <Table
                  columns={columns}
                  dataSource={participants}
                  rowKey="id"
                  pagination={false}
                />
              </>
            )}
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
