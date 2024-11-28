import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Checkbox, Collapse, Form, Input, Radio, Select, Upload, message, Image, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { fetchCategories } from '../../../store/categorySlice';
import { fetchEditPost, fetchPostById } from '../../../store/postSlice';
import { fetchTags } from '../../../store/TagsSlice';
import { errorNotification, successNotification } from '../../../helpers/notificantion';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PlusOutlined } from '@ant-design/icons';

const schema = yup
  .object({
    title: yup.string().required('Hãy nhập title').required(),
  })
  .required();

const Edit = () => {
  const editData = useSelector((state) => state.POST.postSelected);
  const categories = useSelector((state) => state.CATEGORY.list);
  const tags = useSelector((state) => state.TAGS.tags);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
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
    setLoading(true);
    const file = fileList[0]?.originFileObj || null;
    const formData = { ...data, file, id: editData?.id };
    if (formData.file) {
      const dataFile = new FormData();
      dataFile.append('file', formData.file); // Attach the file if present
      formData.dataFile = dataFile;
    }
    const res = await dispatch(fetchEditPost(formData));

    if (res.payload.status) {
      setLoading(false);
      navigate('/admin/posts');
      successNotification('Chỉnh sửa thành công!!');
    } else {
      errorNotification('Cập nhật thất bại');
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById({ id }));
    }
    dispatch(fetchCategories());
    dispatch(fetchTags());
  }, [dispatch, id]);

  useEffect(() => {
    if (editData) {
      setValue('title', editData.title || '');
      setValue('content', editData.content || '');
      setValue('categories', editData.categoryIds || []);
      setValue('tags', editData.tagsIds || []);
      setValue('status', editData.status || 'draft');
      if (editData.thumb) {
        setFileList([
          {
            uid: '-1',
            name: 'thumbnail.png',
            status: 'done',
            url: editData.thumb,
          },
        ]);
      }
    }
  }, [editData, setValue]);

  const handlePreview = async (file) => {
    try {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    } catch (error) {
      message.error('Failed to preview image.');
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleCancelPreview = () => {
    setPreviewOpen(false);
  };

  return (
    <div className="admin-page">
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
      <Card>
        {editData?.title && (
          <h2 style={{ marginBottom: '50px' }}>
            Editing Blog Post: <span style={{ color: '#1677ff' }}>{editData.title}</span>
          </h2>
        )}
        <Form layout="vertical" onFinish={handleSubmit(handleMySubmit)}>
          <Form.Item label="Thumbnail">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
            >
              {fileList.length < 1 && uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: 'none',
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  onVisibleChange: handleCancelPreview,
                }}
                src={previewImage}
              />
            )}
          </Form.Item>

          <Form.Item label="Title">
            <Controller name="title" render={({ field }) => <Input {...field} />} control={control} />
            <p style={{ color: 'red', fontWeight: '600' }}>{errors.title?.message}</p>
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
                      value={field.value}
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
