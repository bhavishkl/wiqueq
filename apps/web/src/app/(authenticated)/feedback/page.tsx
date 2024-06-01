'use client'

import { useState, useEffect } from 'react'
import { Typography, Rate, List, Form, Input, Button, Row, Col } from 'antd'
import { StarFilled } from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function FeedbackPage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [reviews, setReviews] = useState<Model.Review[]>([])
  const [averageRating, setAverageRating] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsFound = await Api.Review.findMany({ includes: ['user'] })
        setReviews(reviewsFound)
        const totalRating = reviewsFound.reduce(
          (acc, review) => acc + (review.rating || 0),
          0,
        )
        setAverageRating(totalRating / reviewsFound.length)
      } catch (error) {
        enqueueSnackbar('Failed to fetch reviews', { variant: 'error' })
      }
    }
    fetchReviews()
  }, [])

  const handleSubmit = async (values: {
    rating: number
    reviewText: string
  }) => {
    if (!userId) {
      enqueueSnackbar('You must be logged in to submit a review', {
        variant: 'error',
      })
      return
    }

    setLoading(true)
    try {
      await Api.Review.createOneByUserId(userId, {
        rating: values.rating,
        reviewText: values.reviewText,
        reviewTime: dayjs().toISOString(),
      })
      enqueueSnackbar('Review submitted successfully', { variant: 'success' })
      router.push('/feedback')
    } catch (error) {
      enqueueSnackbar('Failed to submit review', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout layout="narrow">
      <Row justify="center">
        <Col span={24}>
          <Title level={2}>Feedback Page</Title>
          <Paragraph>
            As a User and Service Provider, you can view the average star
            rating, leave your own star ratings and reviews, and see what others
            think about our app.
          </Paragraph>
          <Title level={4}>Average Rating</Title>
          <Rate disabled value={averageRating} character={<StarFilled />} />
          <Text>{averageRating.toFixed(1)} out of 5</Text>
        </Col>
        <Col span={24}>
          <Title level={4}>Leave a Review</Title>
          <Form onFinish={handleSubmit}>
            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please select a rating' }]}
            >
              <Rate character={<StarFilled />} />
            </Form.Item>
            <Form.Item
              name="reviewText"
              label="Review"
              rules={[{ required: true, message: 'Please enter your review' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Title level={4}>User Reviews</Title>
          <List
            itemLayout="vertical"
            dataSource={reviews}
            renderItem={review => (
              <List.Item key={review.id}>
                <List.Item.Meta
                  title={
                    <span>
                      {review.user?.name}{' '}
                      <Rate
                        disabled
                        value={review.rating}
                        character={<StarFilled />}
                      />
                    </span>
                  }
                  description={dayjs(review.reviewTime).format('MMMM D, YYYY')}
                />
                <Paragraph>{review.reviewText}</Paragraph>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </PageLayout>
  )
}
