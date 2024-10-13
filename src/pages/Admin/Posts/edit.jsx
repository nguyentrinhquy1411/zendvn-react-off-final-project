import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Checkbox, Collapse, Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { fetchCategories } from '../../../store/categorySlice';
import { fetchAddPost, fetchEditPost } from '../../../store/postSlice';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({}).required();

const Edit = () => {
  const editData = useSelector((state) => state.POST.postSelected);
  console.log('editData', editData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: editData?.title || '',
      content: editData?.content || '',
      // Convert comma-separated string to array for categories
      categories: editData?.categories ? editData.categories.split(', ') : [],
      tags: editData?.tags || '',
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.CATEGORY.list);

  const handleMySubmit = async (data) => {
    const updatedData = {
      ...data,
      id: editData?.id, // include id from editData
    };
    console.log('Updated data with ID:', updatedData);
    const res = await dispatch(fetchEditPost(updatedData));

    if (res.payload.status) {
      navigate('/admin/posts');
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="admin-page">
      <Card title="Edit Blog Post">
        <Form layout="vertical" onFinish={handleSubmit(handleMySubmit)}>
          <Form.Item label="Title">
            <Controller name="title" render={({ field }) => <Input {...field} />} control={control} defaultValue="" />
          </Form.Item>
          <Form.Item label="Content">
            <Controller
              name="content"
              render={({ field }) => <Input.TextArea {...field} rows={4} />}
              control={control}
              defaultValue=""
            />
          </Form.Item>

          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel header="Blog Categories" key="1">
              <Form.Item label="Category">
                <Controller
                  name="categories"
                  render={({ field }) => (
                    <Checkbox.Group {...field}>
                      {categories.map((item, idx) => (
                        <Checkbox key={idx} value={item.name} checked={field.value.includes(item.name)}>
                          {item.name}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  )}
                  control={control}
                  defaultValue={[]}
                />
              </Form.Item>
            </Collapse.Panel>
            <Collapse.Panel header="Blog Tags" key="2">
              <Form.Item label="Tag">
                <Controller
                  name="tags"
                  render={({ field }) => <Input {...field} placeholder="Enter tags (comma-separated)" />}
                  control={control}
                  defaultValue=""
                />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>

          {/* Save Button placed at the bottom */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: '20px' }}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Edit;
