'use client'

import { useEffect, useState } from 'react'
import {
  Typography,
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  Row,
  Col,
  Spin,
} from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
const { Title, Text } = Typography
const { Option } = Select
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function BookingsPage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [services, setServices] = useState<Model.Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const queues = await Api.Queue.findMany({
          filters: { id: params.queueId },
          includes: ['services'],
        })
        if (queues.length > 0) {
          setServices(queues[0].services || [])
        }
      } catch (error) {
        enqueueSnackbar('Failed to fetch services', { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [params.queueId])

  const onFinish = async (values: any) => {
    try {
      const bookingTime = dayjs(values.date)
        .hour(values.time.hour())
        .minute(values.time.minute())
        .toISOString()
      await Api.Booking.createOneByUserId(userId, {
        bookingTime,
        service: values.service,
        status: 'confirmed',
        queueId: params.queueId,
      })
      enqueueSnackbar('Booking successful', { variant: 'success' })
      router.push('/my-queues')
    } catch (error) {
      enqueueSnackbar('Booking failed', { variant: 'error' })
    }
  }

  if (loading) {
    return (
      <PageLayout layout="narrow">
        <Spin />
      </PageLayout>
    )
  }

  return (
    <PageLayout layout="narrow">
      <Row justify="center">
        <Col span={24}>
          <Title level={2}>Book a Slot</Title>
          <Text>Select a date, time, and service to book a slot.</Text>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Time"
              name="time"
              rules={[{ required: true, message: 'Please select a time' }]}
            >
              <TimePicker
                use12Hours
                format="h:mm a"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              label="Service"
              name="service"
              rules={[{ required: true, message: 'Please select a service' }]}
            >
              <Select placeholder="Select a service">
                {services.map(service => (
                  <Option key={service.id} value={service.serviceName}>
                    {service.serviceName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckCircleOutlined />}
              >
                Book Now
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </PageLayout>
  )
}
