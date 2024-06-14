'use client'

import {
  LoadingOutlined,
  MailOutlined,
  PhoneOutlined,
  StarFilled,
  UserOutlined,
} from '@ant-design/icons'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'
import { useAuthentication } from '@web/modules/authentication'
import {
  Avatar,
  Button,
  Form,
  Input,
  List,
  Modal,
  Rate,
  Spin,
  Tabs,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

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

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '')

    socket.on('participantJoined', (newParticipant: Model.Participant) => {
      setParticipants(prevParticipants => [...prevParticipants, newParticipant])
    })

    socket.on('participantLeft', (leftParticipant: Model.Participant) => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(participant => participant.id !== leftParticipant.id)
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleJoinQueue = async () => {
    setIsLoading(true)
    try {
      await Api.Participant.createOneByQueueId(queueId, { userId })
      const updatedParticipants = await Api.Participant.findManyByQueueId(queueId)
      setParticipants(updatedParticipants)
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
        const updatedParticipants = await Api.Participant.findManyByQueueId(queueId)
        setParticipants(updatedParticipants)
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

  const calculateEstimatedWaitTime = () => {
    const participantIndex = participants.findIndex(p => p.userId === userId)
    if (participantIndex === -1 || !queue?.averageTime) return 'N/A'
    const [hours, minutes] = queue.averageTime.split(':').map(Number)
    const totalMinutes = (hours * 60) + minutes
    const estimatedWaitTime = dayjs().add(totalMinutes * participantIndex, 'minute')
    return estimatedWaitTime.format('HH:mm')
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>{queue?.name}</Title>
      <Avatar src={queue?.logoUrl} size={64} icon={<UserOutlined />} />
      <Paragraph>{queue?.description}</Paragraph>
      <Paragraph>
        <MailOutlined /> {queue?.contactEmail} <br />
        <PhoneOutlined /> {queue?.contactPhone}
      </Paragraph>
      <Paragraph>
        <strong>Operating Hours:</strong> {queue?.operatingHours}
      </Paragraph>
      <Paragraph>
        <strong>Address:</strong> {queue?.location}
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
                Your position: {participants.find(p => p.userId === userId)?.position || 'N/A'}
              </Paragraph>
              <Paragraph>
                Estimated wait time: {calculateEstimatedWaitTime()}
              </Paragraph>
            </>
          )}
          <List
            header={<div>Reviews</div>}
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
