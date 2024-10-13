import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, Row, Upload } from 'antd';
import React, { useState } from 'react';

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
  },
};

const onFinish = (values) => {
  console.log(values);
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const YourProfile = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
        marginBottom: '50px',
      }}
    >
      {/* Avatar section */}
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        maxCount={1} // Allow only 1 image
      >
        {/* Show the upload button even if an image is uploaded */}
        {uploadButton}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}

      <Form
        {...layout}
        name="profile-form"
        onFinish={onFinish}
        style={{ maxWidth: 600, width: '100%', marginTop: '30px' }}
        validateMessages={validateMessages}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="firstname" label="Firstname" rules={[{ required: true }]}>
              <Input placeholder="Ba edit" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="lastname" label="Lastname" rules={[{ required: true }]}>
              <Input placeholder="Nguyen Van edit" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input placeholder="nguyenvanba" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
              <Input placeholder="nguyenvanbaedit@gmail.com" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="mo ta ngan cua anh Ba" rows={4} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 24,
            style: { textAlign: 'center' },
          }}
        >
          <Button type="primary" htmlType="submit" size="large">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default YourProfile;
