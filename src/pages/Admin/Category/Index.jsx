import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchAdminCategories, fetchDeleteCategory } from '../../../store/categorySlice';
import qs from 'query-string';
import { successNotification } from '../../../helpers/notificantion';

const Index = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location);

  const data = useSelector((state) => state.CATEGORY.adminList.list);

  // Parse query parameters from URL
  const { page = 1, per_page = 3, search = '' } = qs.parse(location.search);

  const [pagination, setPagination] = useState({
    current: Number(page),
    pageSize: Number(per_page),
    total: 0,
  });

  console.log('pagination', pagination);

  useEffect(() => {
    setLoading(true);
    dispatch(
      fetchAdminCategories({
        page: pagination.current,
        per_page: pagination.pageSize,
        search: searchText || search,
      })
    ).then((res) => {
      setPagination({ ...pagination, total: res.payload?.total });
      setLoading(false);
    });
  }, [pagination.current, pagination.pageSize, searchText, search]);

  const updateURL = (params) => {
    const updatedQuery = qs.stringify({ ...qs.parse(location.search), ...params });
    navigate(`?${updatedQuery}`, { replace: true });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);

    // Update URL and reset to the first page
    updateURL({ search: selectedKeys[0], page: 1 });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');

    // Clear search query in the URL
    updateURL({ search: '', page: 1 });
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
    // onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
    setLoading(true); // Show loading while deleting
    await dispatch(fetchDeleteCategory(id)).unwrap(); // Ensure action completes
    // Fetch updated data to refresh the table
    dispatch(
      fetchAdminCategories({
        page: pagination.current,
        per_page: pagination.pageSize,
        search: searchText || search,
      })
    ).then((res) => {
      setPagination({ ...pagination, total: res.payload?.total - 1 });
      setLoading(false); // Stop loading after fetching updated data
      successNotification('Xóa thành công!!');
    });
  };

  const handleTableChange = (newPagination) => {
    setLoading(true);
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });

    // Update URL with new pagination
    updateURL({ page: newPagination.current, per_page: newPagination.pageSize });
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
          <Link to={`/admin/category/${record.id}/edit`}>
            <Button type="link">Edit</Button>
          </Link>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        ...pagination,
        disabled: loading,
      }}
      onChange={handleTableChange}
      loading={loading}
    />
  );
};

export default Index;
