'use client'

import { useEffect, useState } from 'react'
import { Typography, Row, Col, Card, Statistic, Spin } from 'antd'
import {
  UserOutlined,
  LineChartOutlined,
  RiseOutlined,
} from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function QueueAnalyticsPage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [queues, setQueues] = useState<Model.Queue[]>([])
  const [totalUsersServed, setTotalUsersServed] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  })
  const [peakHours, setPeakHours] = useState<string[]>([])
  const [ratingImprovement, setRatingImprovement] = useState<number | null>(
    null,
  )

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const queues = await Api.Queue.findManyByServiceProviderId(userId, {
          includes: ['participants', 'reviews'],
        })
        setQueues(queues)

        // Calculate total users served
        const daily = queues.reduce(
          (acc, queue) =>
            acc +
            (queue.participants?.filter(participant =>
              dayjs(participant.joinTime).isSame(dayjs(), 'day'),
            ).length || 0),
          0,
        )
        const weekly = queues.reduce(
          (acc, queue) =>
            acc +
            (queue.participants?.filter(participant =>
              dayjs(participant.joinTime).isSame(dayjs(), 'week'),
            ).length || 0),
          0,
        )
        const monthly = queues.reduce(
          (acc, queue) =>
            acc +
            (queue.participants?.filter(participant =>
              dayjs(participant.joinTime).isSame(dayjs(), 'month'),
            ).length || 0),
          0,
        )
        setTotalUsersServed({ daily, weekly, monthly })

        // Calculate peak hours
        const hoursMap = new Map()
        queues.forEach(queue => {
          queue.participants?.forEach(participant => {
            const hour = dayjs(participant.joinTime).hour()
            hoursMap.set(hour, (hoursMap.get(hour) || 0) + 1)
          })
        })
        const sortedHours = Array.from(hoursMap.entries()).sort(
          (a, b) => b[1] - a[1],
        )
        setPeakHours(sortedHours.slice(0, 3).map(([hour]) => `${hour}:00`))

        // Calculate rating improvement
        const lastWeekReviews = queues.flatMap(
          queue =>
            queue.reviews?.filter(review =>
              dayjs(review.dateCreated).isSame(
                dayjs().subtract(1, 'week'),
                'week',
              ),
            ) || [],
        )
        const thisWeekReviews = queues.flatMap(
          queue =>
            queue.reviews?.filter(review =>
              dayjs(review.dateCreated).isSame(dayjs(), 'week'),
            ) || [],
        )
        const lastWeekRating =
          lastWeekReviews.reduce(
            (acc, review) => acc + (review.rating || 0),
            0,
          ) / (lastWeekReviews.length || 1)
        const thisWeekRating =
          thisWeekReviews.reduce(
            (acc, review) => acc + (review.rating || 0),
            0,
          ) / (thisWeekReviews.length || 1)
        setRatingImprovement(thisWeekRating - lastWeekRating)

        setLoading(false)
      } catch (error) {
        enqueueSnackbar('Failed to fetch data', { variant: 'error' })
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) {
    return (
      <PageLayout layout="narrow">
        <Spin size="large" />
      </PageLayout>
    )
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Queue Analytics</Title>
      <Paragraph>
        Analyze and improve your service based on the following analytics.
      </Paragraph>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users Served (Daily)"
              value={totalUsersServed.daily}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users Served (Weekly)"
              value={totalUsersServed.weekly}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users Served (Monthly)"
              value={totalUsersServed.monthly}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Peak Hours"
              value={peakHours.join(', ')}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Rating Improvement (This Week)"
              value={
                ratingImprovement !== null
                  ? ratingImprovement.toFixed(2)
                  : 'N/A'
              }
              prefix={<RiseOutlined />}
              valueStyle={{
                color:
                  ratingImprovement && ratingImprovement > 0
                    ? '#3f8600'
                    : '#cf1322',
              }}
            />
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
