import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { successNotification } from '../../../helpers/notificantion';
import { fetchAdminCategories, fetchCategories, fetchDeleteCategory } from '../../../store/categorySlice';

const Index = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  const rawData = useSelector((state) => state.CATEGORY.list);

  // Debug: Log raw data to check if it contains the expected data
  console.log('rawData:', rawData);

  // Function to process data and add dashes for hierarchy visualization
  const buildFlatDataWithDashes = (categories, parentId = 0, level = 0) => {
    return categories
      .filter((category) => category.parent === parentId) // Filter by parent ID
      .flatMap((category) => {
        // Add dashes to the category name
        const updatedCategory = {
          ...category,
          name: `${'— '.repeat(level)}${category.name}`,
        };
        // Recursively process child categories
        return [updatedCategory, ...buildFlatDataWithDashes(categories, category.id, level + 1)];
      });
  };

  const data = buildFlatDataWithDashes(rawData); // Processed data with dashes
  console.log('Processed data:', data); // Debug: Log processed data

  // Fetch data from the server
  useEffect(() => {
    setLoading(true);
    dispatch(fetchCategories({}))
      .then((res) => {
        console.log('API Response Payload:', res.payload); // Debug: Check API response
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setLoading(false);
      });
  }, [dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleDelete = async (id) => {
    setLoading(true);
    await dispatch(fetchDeleteCategory(id))
      .unwrap()
      .then(() => {
        // Refresh data
        dispatch(fetchAdminCategories({})).then(() => {
          setLoading(false);
          successNotification('Xóa thành công!!');
        });
      })
      .catch((err) => {
        console.error('Failed to delete category:', err);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: '40%',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/categories/edit/${record.id}`}>
            <Button type="primary">Edit</Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} pagination={false} loading={loading} rowKey={(record) => record.id} />
  );
};

export default Index;
