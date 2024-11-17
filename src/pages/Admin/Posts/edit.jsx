import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Checkbox, Collapse, Form, Input, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { fetchCategories, fetchTags } from '../../../store/categorySlice';
import { fetchEditPost } from '../../../store/postSlice';

const schema = yup.object({}).required();

const Edit = () => {
  const editData = useSelector((state) => state.POST.postSelected);
  console.log('editData', editData);
  const [selectedTags, setSelectedTags] = useState([]); // To track selected tags

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue, // Added to manually set the form value for tags
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: editData?.title || '',
      content: editData?.content || '',
      // Convert comma-separated string to array for categories
      categories: editData?.categories ? editData.categories.split(', ') : [],
      // Split the comma-separated tags string into an array
      tags: editData?.tags ? editData.tags.split(', ') : [],
      // Handle status (if multiple, split by comma, else default to 'draft')
      status: editData?.status ? editData.status.split(', ') : ['draft'],
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.CATEGORY.list);
  const tags = useSelector((state) => state.CATEGORY.tags);

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
    dispatch(fetchTags());
  }, [dispatch]);

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
              <Form.Item label="Tags">
                <Controller
                  name="tags"
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="tags" // Enable typing and adding new tags
                      allowClear
                      placeholder="Enter or select tags"
                      style={{ width: '100%' }}
                      onChange={(value) => {
                        setSelectedTags(value); // Update selected tags
                        field.onChange(value); // Sync with react-hook-form
                      }}
                      value={field.value} // Bind the value to the field's value
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

          <Form.Item label="Status" style={{ marginTop: '24px' }}>
            <Controller
              name="status"
              render={({ field }) => (
                <Checkbox.Group
                  {...field}
                  checked={field.value || []} // Ensure the value is always an array, default to an empty array if undefined
                  onChange={(checkedValues) => {
                    field.onChange(checkedValues); // Pass the updated value to React Hook Form
                  }}
                >
                  <Checkbox value="draft">Draft</Checkbox>
                  <Checkbox value="public">Public</Checkbox>
                  <Checkbox value="pending">Pending</Checkbox>
                </Checkbox.Group>
              )}
              control={control}
              defaultValue={['draft']} // Default value is set to 'draft' if not provided
            />
          </Form.Item>

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
