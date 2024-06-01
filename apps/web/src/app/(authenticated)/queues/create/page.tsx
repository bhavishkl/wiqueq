'use client'

import { useState, useEffect } from 'react'
import {
  Typography,
  Form,
  Input,
  Button,
  Upload,
  Select,
  Row,
  Col,
  TimePicker,
  Checkbox,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
const { Option } = Select
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function CreateQueuePage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [categories, setCategories] = useState<Model.QueueCategory[]>([])
  const [fileList, setFileList] = useState<any[]>([])
  const [services, setServices] = useState<
    { serviceName: string; serviceDescription?: string }[]
  >([])
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesFound = await Api.QueueCategory.findMany()
        setCategories(categoriesFound)
      } catch (error) {
        enqueueSnackbar('Failed to load categories', { variant: 'error' })
      }
    }

    fetchCategories()
  }, [])

  const handleUpload = async (options: any) => {
    const { file } = options
    try {
      const url = await Api.Upload.upload(file)
      setFileList([{ url, status: 'done' }])
    } catch (error) {
      enqueueSnackbar('Failed to upload logo', { variant: 'error' })
    }
  }

  const handleFinish = async (values: any) => {
    try {
      const queueValues = {
        ...values,
        logoUrl: fileList[0]?.url,
        serviceProviderId: userId,
        operatingHours: values.operatingHours
          .map((time: any) => time.format('HH:mm'))
          .join(' - '),
        services: services,
        averageTime: values.averageTime,
        operatingDays: values.operatingDays,
      }
      await Api.Queue.createOneByServiceProviderId(userId, queueValues)
      enqueueSnackbar('Queue created successfully', { variant: 'success' })
      router.push('/my-queues')
    } catch (error) {
      enqueueSnackbar('Failed to create queue', { variant: 'error' })
    }
  }

  const handleAddService = () => {
    setServices([...services, { serviceName: '', serviceDescription: '' }])
  }

  const handleServiceChange = (index: number, field: string, value: string) => {
    const newServices = [...services]
    newServices[index][field] = value
    setServices(newServices)
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Create Virtual Queue</Title>
      <Paragraph>
        Fill in the details below to create a new virtual queue.
      </Paragraph>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Queue Name"
          rules={[{ required: true, message: 'Please enter the queue name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="logoUrl" label="Logo">
          <Upload fileList={fileList} customRequest={handleUpload} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="location" label="Address">
          <Input />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select>
            {categories.map(category => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="operatingHours"
          label="Operating Hours"
          rules={[{ required: true, message: 'Please select operating hours' }]}
        >
          <TimePicker.RangePicker format="HH:mm" />
        </Form.Item>
        <Form.Item name="contactPhone" label="Contact Phone">
          <Input />
        </Form.Item>
        <Form.Item name="contactEmail" label="Contact Email">
          <Input />
        </Form.Item>
        <Form.Item name="pincode" label="Pincode">
          <Input />
        </Form.Item>
        <Form.Item
          name="averageTime"
          label="Average Time"
          rules={[{ required: true, message: 'Please enter the average time' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="operatingDays"
          label="Operating Days"
          rules={[{ required: true, message: 'Please select operating days' }]}
        >
          <Checkbox.Group>
            <Row>
              <Col span={8}>
                <Checkbox value="Monday">Monday</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="Tuesday">Tuesday</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="Wednesday">Wednesday</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="Thursday">Thursday</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="Friday">Friday</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="Saturday">Saturday</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="Sunday">Sunday</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Title level={4}>Services</Title>
        {services.map((service, index) => (
          <Row key={index} gutter={16}>
            <Col span={12}>
              <Form.Item label="Service Name">
                <Input
                  value={service.serviceName}
                  onChange={e =>
                    handleServiceChange(index, 'serviceName', e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Service Description">
                <Input
                  value={service.serviceDescription}
                  onChange={e =>
                    handleServiceChange(
                      index,
                      'serviceDescription',
                      e.target.value,
                    )
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        ))}
        <Button type="dashed" onClick={handleAddService}>
          Add Service
        </Button>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Queue
          </Button>
        </Form.Item>
      </Form>
    </PageLayout>
  )
}
