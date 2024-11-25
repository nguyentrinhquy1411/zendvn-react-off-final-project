import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table } from 'antd';
import qs from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { actSaveCategoryInfo } from '../../../store/categorySlice';
import { deletetUser, fetchUsers } from '../../../store/usersSlice';
import { successNotification } from '../../../helpers/notificantion';

const dataSource = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

const Index = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const usersList = useSelector((state) => state.USERS.usersPaging.list);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { page = 1, per_page = 3, search = '' } = qs.parse(location.search);
  const [pagination, setPagination] = useState({
    current: Number(page),
    pageSize: Number(per_page),
    total: 0,
  });

  useEffect(() => {
    dispatch(
      fetchUsers({ page: pagination.current, per_page: pagination.pageSize, search: searchText || search })
    ).then((res) => {
      setPagination({ ...pagination, total: res.payload?.total });
      setLoading(false);
    });
  }, [pagination.current, pagination.pageSize, searchText, search]);

  const updateURL = (params) => {
    const updatedQuery = qs.stringify({ ...qs.parse(location.search), ...params });
    navigate(`?${updatedQuery}`, { replace: true });
  };

  useEffect(() => {
    if (usersList && usersList.length > 0) {
      setData(usersList);
    }
  }, [usersList]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    updateURL({ search: selectedKeys[0], page: 1 });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');

    updateURL({ search: '', page: 1 });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleDelete = async (key) => {
    setLoading(true); // Show loading while deleting

    try {
      // Dispatch the delete action and wait for it to finish
      await dispatch(deletetUser(key));
      dispatch(
        fetchUsers({
          page: pagination.current,
          per_page: pagination.pageSize,
          search: searchText || search,
        })
      ).then((res) => {
        setPagination({ ...pagination, total: res.payload?.total - 1 });
        setLoading(false); // Stop loading after fetching updated data
        successNotification('Xóa thành công!!');
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  function handleTableChange(newPagination) {
    setLoading(true);
    setPagination({ ...pagination, current: newPagination.current, pageSize: newPagination.pageSize });
    updateURL({ page: newPagination.current, per_page: newPagination.pageSize });
  }

  const handleEdit = (key) => {
    console.log('Edit record:', key);
    dispatch(actSaveCategoryInfo(key));
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: '25%%',
      ...getColumnSearchProps('username'),
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
      width: '25%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '25%',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record.id)}>
            <Link to={`/admin/profile/${record.id}/edit`}>Edit</Link>
          </Button>
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
      onChange={handleTableChange}
      loading={loading}
      pagination={{
        ...pagination,
        disabled: loading,
      }}
    />
  );
};

export default Index;
