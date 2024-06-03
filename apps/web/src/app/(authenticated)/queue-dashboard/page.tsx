'use client'

import { useEffect, useState } from 'react'
import { Typography, Button, Row, Col, Space, Popconfirm, List } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function QueueDashboardPage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()
  const [queues, setQueues] = useState<Model.Queue[]>([])
  const [categories, setCategories] = useState<Model.QueueCategory[]>([])

  useEffect(() => {
    if (userId) {
      Api.User.findOne(userId, { includes: ['queuesAsServiceProvider'] })
        .then(user => {
          setQueues(user.queuesAsServiceProvider || [])
        })
        .catch(error => {
          enqueueSnackbar('Failed to load queues', { variant: 'error' })
        })
    }

    Api.QueueCategory.findMany()
      .then(categories => {
        setCategories(categories)
      })
      .catch(error => {
        enqueueSnackbar('Failed to load categories', { variant: 'error' })
      })
  }, [userId])

  const handleDeleteQueue = async (queueId: string) => {
    try {
      await Api.Queue.deleteOne(queueId)
      setQueues(queues.filter(queue => queue.id !== queueId))
      enqueueSnackbar('Queue deleted successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to delete queue', { variant: 'error' })
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Queue Dashboard</Title>
      <Paragraph>Manage all your queues from one place.</Paragraph>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <List
            itemLayout="vertical"
            dataSource={queues}
            renderItem={queue => (
              <List.Item
                key={queue.id}
                actions={[
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => router.push(`/queues/${queue.id}/manage`)}
                  >
                    Manage
                  </Button>,
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/queues/${queue.id}/edit`)}
                  >
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Are you sure you want to delete this queue?"
                    onConfirm={() => handleDeleteQueue(queue.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<DeleteOutlined />} danger>
                      Delete
                    </Button>,
                  </Popconfirm>,
                  <Button
                    icon={<BarChartOutlined />}
                    onClick={() =>
                      router.push(`/queue-analytics?queueId=${queue.id}`)
                    }
                  >
                    Analytics
                  </Button>,
                ]}
              >
                <Space direction="vertical">
                  <Title level={4}>{queue.name}</Title>
                  <Text>{queue.description}</Text>
                  <Text type="secondary">Location: {queue.location}</Text>
                  <Text type="secondary">Category: {getCategoryName(queue.category)}</Text>
                  <Text type="secondary">
                    Operating Hours: {queue.operatingHours}
                  </Text>
                </Space>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </PageLayout>
  )
}
