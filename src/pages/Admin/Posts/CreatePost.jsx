import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Upload,
  Image,
  message,
  Spin,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { errorNotification, successNotification } from '../../../helpers/notificantion';
import { fetchCategories } from '../../../store/categorySlice';
import { fetchAddPost } from '../../../store/postSlice';
import { addNewTag, fetchTags } from '../../../store/TagsSlice';

const schema = yup
  .object({
    title: yup.string().required('Hãy nhập title').required(),
  })
  .required();

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreatePost = () => {
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

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
    setLoading(true); // Set loading to true when the form is being submitted
    const file = fileList[0]?.originFileObj || null;
    const formData = { ...data, file };
    if (formData.file) {
      const dataFile = new FormData();
      dataFile.append('file', formData.file); // Attach the file if present
      formData.dataFile = dataFile;
    }

    dispatch(fetchAddPost(formData)).then((res) => {
      setLoading(false); // Reset loading when submission is complete
      if (res.payload.status) {
        navigate('/admin/posts');
        successNotification('Thêm bài viết thành công!!');
      } else {
        errorNotification('Thêm mới thất bại');
      }
    });
  };

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
      const createdTag = await dispatch(addNewTag({ name: newTag })).unwrap();
      setSelectedTags((prevTags) => [...prevTags, createdTag.id]);
      dispatch(fetchTags());
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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="admin-page" style={{ position: 'relative' }}>
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

      <Card title="Add New Blog Post">
        <Form layout="vertical" onFinish={handleSubmit(handleMySubmit)}>
          <Form.Item label="Thumbnail">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length < 1 && uploadButton}
            </Upload>
            {previewImage && (
              <Image
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <Form.Item label="Title">
            <Controller name="title" render={({ field }) => <Input {...field} />} control={control} defaultValue="" />
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

export default CreatePost;
