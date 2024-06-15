'use client'

import { UploadOutlined } from '@ant-design/icons';
import { Api, Model } from '@web/domain';
import { PageLayout } from '@web/layouts/Page.layout';
import { useAuthentication } from '@web/modules/authentication';
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  TimePicker,
  Typography,
  Upload
} from 'antd';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
const { Title, Text } = Typography;
const { Option } = Select;

export default function EditQueuePage() {
  const router = useRouter();
  const params = useParams<any>();
  const authentication = useAuthentication();
  const userId = authentication.user?.id;
  const { enqueueSnackbar } = useSnackbar();
  const [queue, setQueue] = useState<Model.Queue | null>(null);
  const [services, setServices] = useState<Model.Service[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [isUpdated, setIsUpdated] = useState(false); // State to track form changes

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const fetchedQueue = await Api.Queue.findOne(params.queueId, {
          includes: ['services'],
        });
        setQueue(fetchedQueue);
        setServices(fetchedQueue.services || []);
        setFileList([{ url: fetchedQueue.logoUrl, status: 'done' }]);
        form.setFieldsValue({
          name: fetchedQueue.name,
          description: fetchedQueue.description,
          location: fetchedQueue.location,
          category: fetchedQueue.category,
          contactPhone: fetchedQueue.contactPhone,
          contactEmail: fetchedQueue.contactEmail,
          pincode: fetchedQueue.pincode,
          openingHours: dayjs(fetchedQueue.operatingHours?.split(' - ')[0], 'HH:mm'),
          closingHours: dayjs(fetchedQueue.operatingHours?.split(' - ')[1], 'HH:mm'),
          services: fetchedQueue.services.map(service => ({
            serviceName: service.serviceName,
            serviceDescription: service.serviceDescription,
          })),
        });
      } catch (error) {
        enqueueSnackbar('Failed to fetch queue data', { variant: 'error' });
      }
    };

    fetchQueue();
  }, [params.queueId, form]);

  const handleUpload = async (options: any) => {
    const { file } = options;
    const url = await Api.Upload.upload(file);
    setFileList([{ url, status: 'done' }]);
    setIsUpdated(true);
  };

  const handleFinish = async (values: any) => {
    try {
      const updatedQueue = await Api.Queue.updateOne(params.queueId, {
        ...values,
        logoUrl: fileList[0]?.url,
        operatingHours: `${dayjs(values.openingHours).format('HH:mm')} - ${dayjs(values.closingHours).format('HH:mm')}`,
      });
      enqueueSnackbar('Queue updated successfully', { variant: 'success' });
      router.push(`/queues/${params.queueId}/manage`);
    } catch (error) {
      enqueueSnackbar('Failed to update queue', { variant: 'error' });
    }
  };

  const handleFormChange = () => {
    setIsUpdated(true);
  };

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Edit Queue</Title>
      <Text>Update your queue details and services provided.</Text>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={handleFormChange}
      >
        <Form.Item
          name="name"
          label="Queue Name"
          rules={[{ required: true, message: 'Please enter the queue name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="location" label="Address">
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Input />
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
        <Form.Item label="Operating Hours">
          <Space>
            <Form.Item
              name="openingHours"
              noStyle
              rules={[
                { required: true, message: 'Please select opening hours' },
              ]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="closingHours"
              noStyle
              rules={[
                { required: true, message: 'Please select closing hours' },
              ]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="Logo">
          <Upload fileList={fileList} customRequest={handleUpload} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'serviceName']}
                    fieldKey={[fieldKey, 'serviceName']}
                    rules={[
                      { required: true, message: 'Missing service name' },
                    ]}
                  >
                    <Input placeholder="Service Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'serviceDescription']}
                    fieldKey={[fieldKey, 'serviceDescription']}
                  >
                    <Input placeholder="Service Description" />
                  </Form.Item>
                  <Button type="link" onClick={() => remove(name)}>
                    Remove
                  </Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Service
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!isUpdated}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </PageLayout>
  );
}
