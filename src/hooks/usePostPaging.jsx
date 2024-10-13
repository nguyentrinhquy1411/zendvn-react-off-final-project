import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/shared/Button';
import { fetchPaging } from '../store/postSlice';

function usePostPaging(extraParams = {}) {
  const { list: posts, totalpages: totalPages, currentPage, total } = useSelector((state) => state.POST.postPaging);
  console.log('usePostPaging - posts', posts);
  console.log('usePostPaging - currentPage', currentPage);
  console.log('usePostPaging - totalPages', totalPages);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isShowLoadMore = currentPage < totalPages;

  function handleBtnLoadMore() {
    setLoading(true);
    dispatch(fetchPaging({ page: currentPage + 1, ...extraParams })).then((res) => {
      setLoading(false);
    });
  }

  function renderButtonLoadMore() {
    return (
      isShowLoadMore && (
        <div className="text-center">
          <Button type="primary" size="large" loading={loading} onClick={handleBtnLoadMore}>
            Tải thêm
          </Button>
        </div>
      )
    );
  }

  return {
    posts,
    total,
    renderButtonLoadMore,
  };
}

export default usePostPaging;
