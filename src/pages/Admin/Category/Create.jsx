import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Input, Row, Select, Spin } from 'antd';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { fetchAddCategory } from '../../../store/categorySlice';
import { useNavigate } from 'react-router-dom';
import { errorNotification, successNotification } from '../../../helpers/notificantion';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function mappingDataList(item) {
  return {
    value: item.id,
    label: item.name,
  };
}

const schema = yup
  .object({
    name: yup.string().required('Vui lòng nhập tên'),
    slug: yup.string().required('Vui lòng nhập slug'),
  })
  .required();

const Create = () => {
  const categoriesList = useSelector((state) => state.CATEGORY.list);
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const parentOptions = categoriesList.map(mappingDataList);
  parentOptions.unshift({ value: '', label: 'None' });

  const handleMySubmit = (data) => {
    setLoading(true);
    console.log(data);
    // dispatch(fetchAddCategory(data)).then((res) => {
    //   setLoading(false);
    //   if (res.payload.status) {
    //     navigate('/admin/category/');
    //     successNotification('Thêm thành công!!');
    //   } else {
    //     errorNotification('Thêm mới thất bại');
    //   }
    // });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
      }}
    >
      {/* Loading spinner covering the page */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      {/* <form onSubmit={handleSubmit(handleMySubmit)}>
        <input type="text" {...register('name')} />
        <p>{errors.name?.message}</p>
        <input type="text" {...register('slug')} />
        <button type="submit">submit</button>
      </form> */}
      <Form
        {...layout}
        name="basic"
        onFinish={handleSubmit(handleMySubmit)}
        style={{ maxWidth: 600, width: '100%' }} // Set form width
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="Name">
              <Controller
                name="name"
                rules={[{ required: true }]}
                render={({ field }) => <Input placeholder="Enter your name" {...field} />}
                control={control}
                defaultValue=""
              />
              <p style={{ color: 'red', fontWeight: '600' }}>{errors.name?.message}</p>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Slug">
              <Controller
                name="slug"
                render={({ field }) => <Input placeholder="Enter slug" {...field} />}
                control={control}
                defaultValue=""
              />
              <p style={{ color: 'red', fontWeight: '600' }}>{errors.slug?.message}</p>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Select Option">
              <Controller
                name="parent"
                render={({ field }) => <Select options={parentOptions} {...field}></Select>}
                control={control}
                placeholder="Select a parent"
                defaultValue={''}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              wrapperCol={{
                ...layout.wrapperCol,
                offset: 6,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default Create;
