import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Checkbox, Collapse, Form, Input, Radio, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { fetchCategories } from '../../../store/categorySlice';
import { fetchEditPost, fetchPostById } from '../../../store/postSlice';
import { fetchTags } from '../../../store/TagsSlice';
import { successNotification } from '../../../helpers/notificantion';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const schema = yup.object({}).required();

const Edit = () => {
  const editData = useSelector((state) => state.POST.postSelected);
  const categories = useSelector((state) => state.CATEGORY.list);
  const tags = useSelector((state) => state.TAGS.tags);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedTags, setSelectedTags] = useState([]); // To track selected tags

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue, // Used to manually update form values
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      categories: [],
      tags: [],
      status: 'draft',
    },
  });

  const handleMySubmit = async (data) => {
    const updatedData = {
      ...data,
      id: editData?.id, // Include id from editData
    };
    console.log('Updated data with ID:', updatedData);
    const res = await dispatch(fetchEditPost(updatedData));

    if (res.payload.status) {
      navigate('/admin/posts');
      successNotification('Chỉnh sửa thành công!!');
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById({ id }));
    }
    dispatch(fetchCategories());
    dispatch(fetchTags());
  }, [dispatch, id]);

  // Update form values when `editData` changes
  useEffect(() => {
    if (editData) {
      setValue('title', editData.title || '');
      setValue('content', editData.content || '');
      setValue('categories', editData.categoryIds || []);
      setValue('tags', editData.tagsIds || []);
      setValue('status', editData.status || 'draft');
    }
  }, [editData, setValue]);

  const handleTagCreate = async () => {
    if (newTag.trim()) {
      const tagExists = tags.some((tag) => tag.name.toLowerCase() === newTag.trim().toLowerCase());

      if (tagExists) {
        message.warning('This tag already exists.');
        return;
      }

      try {
        const createdTag = await dispatch(addNewTag({ name: newTag.trim() })).unwrap();
        setSelectedTags((prevTags) => [...prevTags, createdTag.id]);
        dispatch(fetchTags());
        setNewTag('');
      } catch (error) {
        console.error('Error creating tag:', error);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleTagCreate();
    }
  };

  return (
    <div className="admin-page">
      <Card>
        {editData?.title && (
          <h2 style={{ marginBottom: '50px' }}>
            Editing Blog Post: <span style={{ color: '#1677ff' }}>{editData.title}</span>
          </h2>
        )}
        <Form layout="vertical" onFinish={handleSubmit(handleMySubmit)}>
          <Form.Item label="Title">
            <Controller name="title" render={({ field }) => <Input {...field} />} control={control} defaultValue="" />
          </Form.Item>
          <Form.Item label="Content">
            <Controller
              name="content"
              render={({ field: { onChange, value } }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={value || ''}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                  }}
                />
              )}
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
                      {categories.map((item) => (
                        <Checkbox key={item.id} value={item.id} checked={field.value.includes(item.id)}>
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
                      mode="tags"
                      allowClear
                      placeholder="Enter or select tags"
                      style={{ width: '100%' }}
                      onChange={(value) => {
                        setSelectedTags(value);
                        field.onChange(value);
                      }}
                      value={field.value}
                      options={tags.map((tag) => ({
                        label: tag.name,
                        value: tag.id,
                      }))}
                      onKeyDown={handleKeyDown}
                    />
                  )}
                  control={control}
                  defaultValue={[]}
                />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>

          <Form.Item label="Status" style={{ marginTop: '24px' }}>
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
              defaultValue={'draft'}
            />
          </Form.Item>

          <Form.Item>
            <Link to="/admin/posts" style={{ marginRight: '10px' }}>
              <Button>Back</Button>
            </Link>
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
