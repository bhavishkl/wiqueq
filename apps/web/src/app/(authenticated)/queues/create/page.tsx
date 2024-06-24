'use client' // Add this directive at the top of the file

import { MinusCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Api } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'
import { useAuthentication } from '@web/modules/authentication'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  TimePicker,
  Typography,
  Upload,
} from 'antd'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

const { Title, Paragraph } = Typography
const { Option } = Select

export default function CreateQueuePage() {
  const router = useRouter()
  const authentication = useAuthentication()
  const { enqueueSnackbar } = useSnackbar()
  const [queueServices, setQueueServices] = useState<
    { serviceName: string; serviceDescription?: string }[]
  >([])
  // Predefined categories
  const predefinedCategories = [
    { id: 'retail', name: 'Retail' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'banking', name: 'Banking' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'restraunt', name: 'Restraunt' },
  ]

  const [fileList, setFileList] = useState<any[]>([])
  const [services, setServices] = useState<
    { serviceName: string; serviceDescription?: string }[]
  >([])
  const [form] = Form.useForm()
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [cities, setCities] = useState<{ label: string; value: string }[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const userId = authentication.user.id

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
        averageTime: values.averageTime.format('HH:mm'),
        operatingDays: values.operatingDays,
        services: values.services.map(service => ({ serviceName: service })),
        location: selectedCity,
      }
      await Api.Queue.createOneByServiceProviderId(userId, queueValues)
      enqueueSnackbar('Queue created successfully', { variant: 'success' })
      router.push('/queue-dashboard')
    } catch (error) {
      enqueueSnackbar('Failed to create queue', { variant: 'error' })
    }
  }

  const handleAddService = () => {
    setServices([...services, { serviceName: '' }])
    setQueueServices(services) // Update the queue services state
  }

  const handleServiceChange = (index: number, field: string, value: string) => {
    const newServices = [...services]
    newServices[index][field] = value
    setServices(newServices)
    setQueueServices(newServices) // Update the queue services state
  }

  const emailValidator = (rule: any, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value || emailRegex.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject('Please enter a valid email address')
  }

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=&types=cities&key=YOUR_GOOGLE_MAPS_API_KEY`,
        )
        const data = await response.json()
        const cities = data.predictions.map((prediction: any) => ({
          label: prediction.description,
          value: prediction.place_id,
        }))
        setCities(cities)
      } catch (error) {
        console.error('Error fetching cities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

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
        <Form.Item
          name="location"
          label="City"
          rules={[{ required: true, message: 'Please select a city' }]}
        >
          <Select
            showSearch
            placeholder="Select a city"
            optionFilterProp="children"
            onChange={(value) => setSelectedCity(value)}
            filterOption={(input, option) =>
  (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
}
            }
            loading={loading}
          >
            {cities.map((city) => (
              <Option key={city.value} value={city.value}>
                {city.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select>
            {predefinedCategories.map(category => (
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
        <Form.Item
          name="contactEmail"
          label="Contact Email"
          rules={[
            { required: true, message: 'Please enter the contact email' },
            { validator: emailValidator },
          ]}
        >
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
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item
          name="operatingDays"
          label="Operating Days"
          rules={[{ required: true, message: 'Please select operating days' }]}
        >
          <Select mode="multiple">
            <Option value="Monday">Monday</Option>
            <Option value="Tuesday">Tuesday</Option>
            <Option value="Wednesday">Wednesday</Option>
            <Option value="Thursday">Thursday</Option>
            <Option value="Friday">Friday</Option>
            <Option value="Saturday">Saturday</Option>
            <Option value="Sunday">Sunday</Option>
          </Select>
        </Form.Item>
        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'serviceName']}
                    fieldKey={[fieldKey, 'serviceName']}
                    rules={[{ required: true, message: 'Please input service name' }]}
                  >
                    <Input placeholder="Service Name" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                Add Service
              </Button>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Queue
          </Button>
        </Form.Item>
      </Form>
    </PageLayout>
  }
}
