import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { fetchAddCategory, fetchEditCategory } from '../../../store/categorySlice';
import { useNavigate } from 'react-router-dom';

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
    name: yup.string().required('bat buoc nhap'),
    slug: yup.string(),
  })
  .required();

const Edit = () => {
  const categoriesList = useSelector((state) => state.CATEGORY.list);
  const dispatch = useDispatch();
  const editData = useSelector((state) => state.CATEGORY.selectedCategory);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: editData?.name || '',
      slug: editData?.slug || '',
      parent: editData?.parent || '',
    },
  });
  const navigate = useNavigate();

  console.log(editData);

  const parentOptions = categoriesList.map(mappingDataList);
  parentOptions.unshift({ value: '', label: 'None' });
  const handleMySubmit = async (data) => {
    const updatedData = {
      ...data,
      id: editData?.id, // include id from editData
    };
    console.log('Updated data with ID:', updatedData);
    const res = await dispatch(fetchEditCategory(updatedData));

    if (res.payload.status) {
      navigate('/admin/category');
    }
  };

  useEffect(() => {
    if (editData) {
      // Reset form fields when editData changes
      reset({
        name: editData.name || '',
        slug: editData.slug || '',
        parent: editData.parent || '',
      });
    }
  }, [editData, reset]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
      }}
    >
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
              <p>{errors.name?.message}</p>
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
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Parent">
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
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default Edit;