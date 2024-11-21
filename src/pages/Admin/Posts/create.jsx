import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Checkbox, Collapse, Form, Input, Radio, Select, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { successNotification } from '../../../helpers/notificantion';
import { fetchCategories } from '../../../store/categorySlice';
import { fetchAddPost } from '../../../store/postSlice';
import { addNewTag, fetchTags } from '../../../store/TagsSlice';

const schema = yup.object({}).required();

const Create = () => {
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

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
  const tags = useSelector((state) => state.TAGS.tags);
  const navigate = useNavigate();

  const handleMySubmit = (data) => {
    console.log('data submit', data);
    dispatch(fetchAddPost(data)).then((res) => {
      console.log(res.payload.status);

      if (res.payload.status) {
        navigate('/admin/posts');
        successNotification('Thêm bài viết thành công!!');
      }
    });
  };

  const handleTagCreate = async () => {
    if (!newTag.trim()) {
      message.warning('Tag name cannot be empty.');
      return;
    }

    const tagExists = tags.some((tag) => tag.name.toLowerCase() === newTag.toLowerCase());

    if (tagExists) {
      message.warning('This tag already exists.');
      return;
    }

    try {
      const createdTag = await dispatch(addNewTag({ name: newTag })).unwrap(); // Use `unwrap` for correct promise handling
      setSelectedTags((prevTags) => [...prevTags, createdTag.id]);
      dispatch(fetchTags()); // Refresh tags list
      setNewTag('');
    } catch (error) {
      console.error('Error creating tag:', error);
      message.error('Failed to create new tag.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleTagCreate();
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
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

          <Collapse defaultActiveKey={['1']} style={{ marginBottom: '24px' }}>
            <Collapse.Panel header="Blog Categories" key="1">
              <Form.Item label="Categories">
                <Controller
                  name="categories"
                  render={({ field }) => (
                    <Checkbox.Group {...field}>
                      {categories.map((item) => (
                        <Checkbox key={item.id} value={item.id}>
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
              <Form.Item label="Tags">
                <Controller
                  name="tags"
                  render={({ field }) => (
                    <Select
                      mode="multiple"
                      placeholder="Select tags"
                      style={{ width: '100%' }}
                      onChange={(value) => {
                        setSelectedTags(value);
                        field.onChange(value);
                      }}
                      onKeyDown={handleKeyDown}
                      value={selectedTags}
                      options={tags.map((tag) => ({
                        label: tag.name,
                        value: tag.id,
                      }))}
                    />
                  )}
                  control={control}
                  defaultValue={[]}
                />
              </Form.Item>
              <Space>
                <Input placeholder="Add a new tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                <Button type="primary" onClick={handleTagCreate}>
                  Add Tag
                </Button>
              </Space>
            </Collapse.Panel>
          </Collapse>

          <Form.Item label="Status">
            <Controller
              name="status"
              render={({ field }) => (
                <Radio.Group {...field}>
                  <Radio value="draft">Draft</Radio>
                  <Radio value="publish">Publish</Radio>
                  <Radio value="pending">Pending</Radio>
                </Radio.Group>
              )}
              control={control}
              defaultValue="draft"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Create;
