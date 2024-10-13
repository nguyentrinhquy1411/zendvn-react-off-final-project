import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Checkbox, Collapse, Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { fetchCategories } from '../../../store/categorySlice';
import { fetchAddPost } from '../../../store/postSlice';

const schema = yup.object({}).required();

const Create = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.CATEGORY.list);

  const handleMySubmit = (data) => {
    console.log(data);
    dispatch(fetchAddPost(data));
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="admin-page">
      <Card title="Add New Blog Post">
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
                  name="category"
                  render={({ field }) => (
                    <Checkbox.Group {...field}>
                      {categories.map((item, idx) => (
                        <Checkbox key={idx} value={item.name}>
                          {item.name}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  )}
                  control={control}
                  defaultValue=""
                />
              </Form.Item>
            </Collapse.Panel>
            <Collapse.Panel header="Blog Tags" key="2">
              <Form.Item label="Tag">
                <Controller
                  name="tag"
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
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Create;
