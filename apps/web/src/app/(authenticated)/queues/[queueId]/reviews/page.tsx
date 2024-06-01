'use client'

import React, { useEffect, useState } from 'react'
import {
  Typography,
  Rate,
  List,
  Avatar,
  Form,
  Input,
  Button,
  Row,
  Col,
} from 'antd'
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons'
const { Title, Paragraph } = Typography
const { TextArea } = Input
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function ReviewsPage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [reviews, setReviews] = useState<Model.Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 0, reviewText: '' })

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsFound = await Api.Review.findManyByQueueId(
          params.queueId,
          { includes: ['user'] },
        )
        setReviews(reviewsFound)
      } catch (error) {
        enqueueSnackbar('Failed to fetch reviews', { variant: 'error' })
      }
    }

    fetchReviews()
  }, [params.queueId])

  const handleReviewSubmit = async () => {
    if (!userId) {
      enqueueSnackbar('You must be logged in to submit a review', {
        variant: 'error',
      })
      return
    }

    try {
      await Api.Review.createOneByQueueId(params.queueId, {
        rating: newReview.rating,
        reviewText: newReview.reviewText,
        userId,
        reviewTime: new Date().toISOString(),
      })
      enqueueSnackbar('Review submitted successfully', { variant: 'success' })
      setNewReview({ rating: 0, reviewText: '' })
      // Re-fetch reviews after submission
      const reviewsFound = await Api.Review.findManyByQueueId(params.queueId, {
        includes: ['user'],
      })
      setReviews(reviewsFound)
    } catch (error) {
      enqueueSnackbar('Failed to submit review', { variant: 'error' })
    }
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Queue Reviews</Title>
      <Paragraph>
        Read and write reviews for the queues you have joined.
      </Paragraph>
      <Row justify="center">
        <Col span={24}>
          <Form layout="vertical" onFinish={handleReviewSubmit}>
            <Form.Item label="Rating">
              <Rate
                value={newReview.rating}
                onChange={value =>
                  setNewReview({ ...newReview, rating: value })
                }
              />
            </Form.Item>
            <Form.Item label="Review">
              <TextArea
                rows={4}
                value={newReview.reviewText}
                onChange={e =>
                  setNewReview({ ...newReview, reviewText: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit Review
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <List
        itemLayout="horizontal"
        dataSource={reviews}
        renderItem={review => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src={review.user?.pictureUrl} icon={<UserOutlined />} />
              }
              title={review.user?.name}
              description={
                <>
                  <Rate disabled value={review.rating} />
                  <Paragraph>{review.reviewText}</Paragraph>
                  <Paragraph>
                    <ClockCircleOutlined /> {dayjs(review.reviewTime).fromNow()}
                  </Paragraph>
                </>
              }
            />
          </List.Item>
        )}
      />
    </PageLayout>
  )
}
