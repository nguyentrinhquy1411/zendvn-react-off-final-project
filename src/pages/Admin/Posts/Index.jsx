import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';
import { actSavePostInfo, fetchAdminPaging, fetchAll, fetchPaging } from '../../../store/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTags } from '../../../store/categorySlice';

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
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.POST.postPaging.list);
  const categories = useSelector((state) => state.CATEGORY.list);
  const tags = useSelector((state) => state.CATEGORY.tags);

  console.log('posts', postList);

  useEffect(() => {
    dispatch(fetchAdminPaging({ page: pagination.current, per_page: pagination.pageSize })).then((res) => {
      setPagination({ ...pagination, total: res.payload?.total });
      setLoading(false);
    });
  }, [pagination.current]);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    if (postList && postList.length > 0) {
      setData(postList.map(mappingpostList));
    }
  }, [postList, categories, tags]);

  function mappingpostList(item) {
    return {
      id: item.id,
      title: item.title,
      author: item.authorData.nickname,
      content: item.content,
      slug: item.slug,
      categories: categories
        .filter((category) => item.categoryIds.includes(category.id)) // Filter categories to only include matching category IDs
        .map((category) => category.name) // Return the names of the categories
        .join(', '),
      tags:
        tags
          .filter((tag) => item.tagsIds.includes(tag.id)) // Filter categories to only include matching tag IDs
          .map((tag) => tag.name) // Return the names of the categories
          .join(', ') || '___',
      status: item.status || 'draft',
    };
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    dispatch(
      fetchAdminPaging({
        page: 1, // Reset to the first page on a new search
        per_page: pagination.pageSize, // Keep the current page size
        search: selectedKeys[0], // Use the entered search text
      })
    ).then((res) => {
      // Update the pagination's total count if necessary
      setPagination({ ...pagination, current: 1, total: res.payload?.total });
      setLoading(false);
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  function handleTableChange(newPagination) {
    setLoading(!loading);
    setPagination({ ...pagination, current: newPagination.current });
  }

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
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const handleDelete = (key) => {
    console.log(key);
  };

  const handleEdit = (key) => {
    console.log('Edit record:', key);
    dispatch(actSavePostInfo(key));
    // You can implement a modal or form to edit the record here
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: '15%',
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      width: '25%',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: '25%',
    },
    {
      title: 'Status', // New column for status
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (text) => <span>{text}</span>, // You can render the status as text or customize it
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            <Link to={`/admin/posts/${record.id}/edit`}>Edit</Link>
          </Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
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
    />
  );
};

export default Index;
