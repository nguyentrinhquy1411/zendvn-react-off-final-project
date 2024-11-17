import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Checkbox, Collapse, Form, Input, Radio, Select, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { fetchCategories, fetchTags } from '../../../store/categorySlice';
import { fetchAddPost } from '../../../store/postSlice';
import { addNewTag } from '../../../store/TagsSlice';

const schema = yup.object({}).required();

const Create = () => {
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // To track selected tags

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
  const tags = useSelector((state) => state.CATEGORY.tags);

  console.log('tags', tags);

  const handleMySubmit = (data) => {
    console.log('data submit', data);
    dispatch(fetchAddPost(data));
  };

  const handleTagCreate = async () => {
    if (newTag.trim()) {
      // Check if the tag already exists
      const tagExists = tags.some((tag) => tag.name.toLowerCase() === newTag.trim().toLowerCase());

      if (tagExists) {
        // If tag already exists, show a message and do not create the tag
        message.warning('This tag already exists.');
        return;
      }

      try {
        const createdTag = await dispatch(addNewTag({ name: newTag.trim() })).unwrap();
        // Update the selectedTags list after successful creation
        setSelectedTags((prevTags) => [
          ...prevTags,
          createdTag.id, // Add the new tag id to the selectedTags
        ]);
        dispatch(fetchTags()); // Optionally refetch the tag list to include the new tag
        setNewTag(''); // Clear input after successful creation
      } catch (error) {
        console.error('Error creating tag:', error);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key press
      handleTagCreate(); // Run the API function when Enter is pressed
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
            {/* Categories Panel */}
            <Collapse.Panel header="Blog Categories" key="1">
              <Form.Item label="Categories">
                <Controller
                  name="categories"
                  render={({ field }) => (
                    <Space direction="horizontal">
                      {categories.map((item, idx) => (
                        <Radio key={idx} value={item.id} {...field}>
                          {item.name}
                        </Radio>
                      ))}
                    </Space>
                  )}
                  control={control}
                  defaultValue={[]} // Array of selected categories
                />
              </Form.Item>
            </Collapse.Panel>

            {/* Tags Panel */}
            <Collapse.Panel header="Blog Tags" key="2">
              <Form.Item label="Tags">
                <Controller
                  name="tags"
                  render={({ field }) => (
                    <Select
                      mode="tags" // Enable typing and adding new tags
                      allowClear
                      placeholder="Enter or select tags"
                      style={{ width: '100%' }}
                      onChange={(value) => {
                        setSelectedTags(value); // Update selected tags
                        field.onChange(value); // Sync with react-hook-form
                      }}
                      value={selectedTags} // Bind to selectedTags state
                      options={tags.map((tag) => ({
                        label: tag.name,
                        value: tag.id,
                      }))}
                      onKeyDown={handleKeyDown} // Attach keyDown handler
                    />
                  )}
                  control={control}
                  defaultValue={[]} // Array of selected tags
                />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>

          {/* Status Field */}
          <Form.Item label="Status" style={{ marginTop: '24px' }}>
            <Controller
              name="status"
              render={({ field }) => (
                <Checkbox.Group {...field}>
                  <Checkbox value="draft">Draft</Checkbox>
                  <Checkbox value="public">Public</Checkbox>
                  <Checkbox value="pending">Pending</Checkbox>
                </Checkbox.Group>
              )}
              control={control}
              defaultValue={['draft']}
            />
          </Form.Item>

          {/* Submit Button */}
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
