'use client'

import { useEffect, useState } from 'react'
import {
  Tabs,
  Button,
  Spin,
  Typography,
  List,
  Avatar,
  Modal,
  Form,
  Input,
  Rate,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  StarFilled,
  LoadingOutlined,
} from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function QueueDetailsPage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [queue, setQueue] = useState<Model.Queue | null>(null)
  const [participants, setParticipants] = useState<Model.Participant[]>([])
  const [reviews, setReviews] = useState<Model.Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInQueue, setIsInQueue] = useState(false)
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false)

  const queueId = params.queueId

  useEffect(() => {
    const fetchQueueDetails = async () => {
      try {
        const queueData = await Api.Queue.findOne(queueId, {
          includes: ['participants.user', 'reviews.user'],
        })
        setQueue(queueData)
        const sortedParticipants = (queueData.participants || []).sort(
          (a, b) => new Date(a.joinTime).getTime() - new Date(b.joinTime).getTime()
        )
        setParticipants(sortedParticipants)
        setReviews(queueData.reviews || [])
        setIsInQueue(
          queueData.participants?.some(
            participant => participant.userId === userId,
          ) || false,
        )
      } catch (error) {
        enqueueSnackbar('Failed to load queue details', { variant: 'error' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQueueDetails()
  }, [queueId, userId])

  const handleJoinQueue = async () => {
    setIsLoading(true)
    try {
      await Api.Participant.createOneByQueueId(queueId, { userId })
      setIsInQueue(true)
      enqueueSnackbar('Successfully joined the queue', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to join the queue', { variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveQueue = async () => {
    setIsLoading(true)
    try {
      const participant = participants.find(
        participant => participant.userId === userId,
      )
      if (participant) {
        await Api.Participant.deleteOne(participant.id)
        setIsInQueue(false)
        enqueueSnackbar('Successfully left the queue', { variant: 'success' })
      }
    } catch (error) {
      enqueueSnackbar('Failed to leave the queue', { variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewSubmit = async (values: {
    rating: number
    reviewText: string
  }) => {
    setIsLoading(true)
    try {
      await Api.Review.createOneByQueueId(queueId, { ...values, userId })
      enqueueSnackbar('Review submitted successfully', { variant: 'success' })
      setIsReviewModalVisible(false)
    } catch (error) {
      enqueueSnackbar('Failed to submit review', { variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <PageLayout layout="narrow">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </PageLayout>
    )
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>{queue?.name}</Title>
      <Paragraph>{queue?.description}</Paragraph>
      <Avatar src={queue?.logoUrl} size={64} icon={<UserOutlined />} />
      <Paragraph>
        <MailOutlined /> {queue?.contactEmail} <br />
        <PhoneOutlined /> {queue?.contactPhone}
      </Paragraph>
      <Paragraph>
        <StarFilled />{' '}
        {queue?.reviews?.reduce(
          (acc, review) => acc + (review.rating || 0),
          0,
        ) / (queue?.reviews?.length || 1)}{' '}
        ({queue?.reviews?.length} reviews)
      </Paragraph>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Details" key="1">
          {isInQueue && (
            <>
              <Paragraph>
                Your position:{' '}
                {
                  participants.find(
                    participant => participant.userId === userId,
                  )?.position
                }
              </Paragraph>
              <Paragraph>
                Estimated wait time:{' '}
                {dayjs()
                  .add(
                    participants.find(
                      participant => participant.userId === userId,
                    )?.position || 0,
                    'minute',
                  )
                  .format('HH:mm')}
              </Paragraph>
            </>
          )}
          <List
            header={<div>Top 3 Reviews</div>}
            dataSource={reviews.slice(0, 3)}
            renderItem={review => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={review.user?.pictureUrl} />}
                  title={review.user?.name}
                  description={review.reviewText}
                />
                <div>
                  {review.rating} <StarFilled />
                </div>
              </List.Item>
            )}
          />
          <Button onClick={() => setIsReviewModalVisible(true)}>
            Leave a Review
          </Button>
          <Button onClick={() => router.push(`/queues/${queueId}/reviews`)}>
            View All Reviews
          </Button>
        </TabPane>
        {isInQueue && (
          <TabPane tab="Queue Participants" key="2">
            <List
              dataSource={participants}
              renderItem={participant => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={participant.user?.pictureUrl} />}
                    title={participant.user?.name}
                    description={`Position: ${participants.indexOf(participant) + 1}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        )}
      </Tabs>
      <Button
        type="primary"
        onClick={() => router.push(`/queues/${queueId}/bookings`)}
      >
        Book Slot
      </Button>
      {isInQueue ? (
        <Button type="default" onClick={handleLeaveQueue}>
          Leave Queue
        </Button>
      ) : (
        <Button type="primary" onClick={handleJoinQueue}>
          Join Queue
        </Button>
      )}
      <Modal
        title="Leave a Review"
        visible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleReviewSubmit}>
          <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
            <Rate />
          </Form.Item>
          <Form.Item
            name="reviewText"
            label="Review"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  )
}
