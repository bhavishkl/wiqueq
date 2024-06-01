'use client'

import { useEffect, useState } from 'react'
import { Typography, List, Card, Button, Spin, Row, Col } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
const { Title, Text } = Typography
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function FavoritesPage() {
  const router = useRouter()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()
  const [favorites, setFavorites] = useState<Model.Favorite[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (userId) {
      Api.User.findOne(userId, { includes: ['favorites', 'favorites.queue'] })
        .then(user => {
          setFavorites(user.favorites || [])
        })
        .catch(error => {
          enqueueSnackbar('Failed to load favorites', { variant: 'error' })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [userId])

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await Api.Favorite.deleteOne(favoriteId)
      setFavorites(favorites.filter(fav => fav.id !== favoriteId))
      enqueueSnackbar('Favorite removed successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to remove favorite', { variant: 'error' })
    }
  }

  return (
    <PageLayout layout="narrow">
      <Row justify="center">
        <Col xs={24} md={20} lg={16}>
          <Title level={2}>My Favorite Queues</Title>
          <Text>Manage and view your favorite queues here.</Text>
          {loading ? (
            <Spin size="large" />
          ) : (
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={favorites}
              renderItem={favorite => (
                <List.Item>
                  <Card
                    title={favorite.queue?.name}
                    extra={
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveFavorite(favorite.id)}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <p>{favorite.queue?.description}</p>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Col>
      </Row>
    </PageLayout>
  )
}
