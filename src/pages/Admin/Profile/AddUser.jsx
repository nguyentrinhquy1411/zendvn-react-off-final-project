import React from 'react';
import { Button, Form, Input, InputNumber, Row, Col, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const onFinish = (values) => {
  console.log(values);
};

const AddUser = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '50px',
    }}
  >
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      style={{ maxWidth: 800, margin: '50px 0px 0px 0px ' }} // Increased the form width
      validateMessages={validateMessages}
    >
      <Row justify="center" style={{ marginBottom: '30px' }}>
        {' '}
        {/* Center the Upload button */}
        <Upload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" listType="picture" maxCount={1}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name={['user', 'name']} label="Username" rules={[{ required: true }]}>
            <Input size="large" /> {/* Increased input size */}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={['user', 'email']} label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" /> {/* Increased input size */}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={['user', 'firstName']} label="First name" rules={[{ type: 'text' }]}>
            <InputNumber size="large" style={{ width: '100%' }} /> {/* Adjusted width */}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={['user', 'lastName']} label="Last name" rules={[{ type: 'text' }]}>
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={20}>
          <Form.Item
            name={['user', 'password']}
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
            {/* Larger text area */}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            wrapperCol={{
              ...layout.wrapperCol,
              offset: 8,
            }}
          >
            <Button type="primary" size="large" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </div>
);

export default AddUser;
