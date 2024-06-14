'use client'

import { useEffect, useState } from 'react'
import {
  Typography,
  Input,
  Select,
  List,
  Button,
  Spin,
  Space,
  Row,
  Col,
  Card,
  Rate,
} from 'antd'
import { StarOutlined, StarFilled } from '@ant-design/icons'
const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function HomePage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [queues, setQueues] = useState<Model.Queue[]>([])
  const [categories, setCategories] = useState<Model.QueueCategory[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  )
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [participants, setParticipants] = useState<string[]>([])
  const [participantsCount, setParticipantsCount] = useState<{ [key: string]: number }>({})
  const [averageWaitTime, setAverageWaitTime] = useState<number>(5)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [queuesData, categoriesData, favoritesData, participantsData, averageWaitTimeData] =
          await Promise.all([
            Api.Queue.findMany({
              includes: ['reviews', 'participants', 'favorites'],
            }),
            Api.QueueCategory.findMany(),
            Api.Favorite.findManyByUserId(userId),
            Api.Participant.findManyByUserId(userId),
            Api.Queue.getAverageWaitTime() // Assuming this is the correct API call to get the average wait time
          ])
        setQueues(queuesData)
        setCategories(categoriesData)
        setFavorites(favoritesData.map(fav => fav.queueId))
        setParticipants(participantsData.map(part => part.queueId))
        setAverageWaitTime(averageWaitTimeData)

        const participantsCountData: { [key: string]: number } = {}
        queuesData.forEach(queue => {
          participantsCountData[queue.id] = queue.participants?.length || 0
        })
        setParticipantsCount(participantsCountData)
      } catch (error) {
        enqueueSnackbar('Failed to load data', { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  const handleJoinQueue = async (queueId: string) => {
    setLoading(true)
    try {
      await Api.Participant.createOneByQueueId(queueId, { userId })
      setParticipants([...participants, queueId])
      setParticipantsCount(prev => ({
        ...prev,
        [queueId]: (prev[queueId] || 0) + 1
      }))
      enqueueSnackbar('Joined queue successfully', { variant: 'success' })
      router.push(`/queues/${queueId}`)
    } catch (error) {
      enqueueSnackbar('Failed to join queue', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveQueue = async (queueId: string) => {
    setLoading(true)
    try {
      const participant = await Api.Participant.findManyByUserId(userId, {
        includes: ['queue'],
      })
      const participantToLeave = participant.find(
        part => part.queueId === queueId,
      )
      if (participantToLeave) {
        await Api.Participant.deleteOne(participantToLeave.id)
        setParticipants(participants.filter(id => id !== queueId))
        setParticipantsCount(prev => ({
          ...prev,
          [queueId]: (prev[queueId] || 0) - 1
        }))
        enqueueSnackbar('Left queue successfully', { variant: 'success' })
      }
    } catch (error) {
      enqueueSnackbar('Failed to leave queue', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = async (queueId: string) => {
    setLoading(true)
    try {
      if (favorites.includes(queueId)) {
        const favorite = await Api.Favorite.findManyByUserId(userId, {
          includes: ['queue'],
        })
        const favoriteToDelete = favorite.find(fav => fav.queueId === queueId)
        if (favoriteToDelete) {
          await Api.Favorite.deleteOne(favoriteToDelete.id)
          setFavorites(favorites.filter(id => id !== queueId))
          enqueueSnackbar('Removed from favorites', { variant: 'success' })
        }
      } else {
        await Api.Favorite.createOneByQueueId(queueId, { userId })
        setFavorites([...favorites, queueId])
        enqueueSnackbar('Added to favorites', { variant: 'success' })
      }
    } catch (error) {
      enqueueSnackbar('Failed to update favorites', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const filteredQueues = queues.filter(queue => {
    return (
      queue.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || queue.category === selectedCategory)
    )
  })

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Unknown Category'
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Virtual Queues</Title>
      <Text>Choose a queue to join or add to your favorites</Text>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Search
          placeholder="Search queues"
          onSearch={handleSearch}
          enterButton
        />
        <Select
          placeholder="Filter by category"
          onChange={handleCategoryChange}
          allowClear
          style={{ width: '100%' }}
        >
          {categories.map(category => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
        {loading ? (
          <Spin tip="Loading..." />
        ) : (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={filteredQueues}
            renderItem={queue => (
              <List.Item>
                <Card
                  title={queue.name}
                  extra={
                    <Rate
                      disabled
                      defaultValue={
                        queue.reviews?.reduce(
                          (acc, review) => acc + review.rating,
                          0,
                        ) / queue.reviews?.length || 0
                      }
                    />
                  }
                  style={{ width: '100%' }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text>
                        Estimated Wait Time: {queue.participants?.length * averageWaitTime}{' '}
                        mins
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text>Participants: {participantsCount[queue.id]}</Text>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: '10px' }}>
                    <Col span={12}>
                      {participants.includes(queue.id) ? (
                        <Button
                          type="primary"
                          danger
                          onClick={() => handleLeaveQueue(queue.id)}
                        >
                          Leave Queue
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          onClick={() => handleJoinQueue(queue.id)}
                        >
                          Join Queue
                        </Button>
                      )}
                    </Col>
                    <Col span={12}>
                      <Button
                        onClick={() => router.push(`/queues/${queue.id}`)}
                      >
                        Details
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: '10px' }}>
                    <Col span={24}>
                      <Button
                        type="link"
                        icon={
                          favorites.includes(queue.id) ? (
                            <StarFilled />
                          ) : (
                            <StarOutlined />
                          )
                        }
                        onClick={() => handleFavoriteToggle(queue.id)}
                      >
                        {favorites.includes(queue.id)
                          ? 'Remove from Favorites'
                          : 'Add to Favorites'}
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: '10px' }}>
                    <Col span={24}>
                      <Text>Category: {getCategoryName(queue.category)}</Text>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Space>
    </PageLayout>
  )
}
