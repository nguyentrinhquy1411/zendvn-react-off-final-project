import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/shared/Button';
import { fetchPaging } from '../store/postSlice';
import { useTranslation } from 'react-i18next';

function usePostPaging(extraParams = {}) {
  const { list: posts, totalpages: totalPages, currentPage, total } = useSelector((state) => state.POST.postPaging);
  const lang = useSelector((state) => state.POST.lang);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isShowLoadMore = currentPage < totalPages;
  const { t } = useTranslation();

  function handleBtnLoadMore() {
    setLoading(true);
    dispatch(fetchPaging({ page: currentPage + 1, ...extraParams, lang })).then((res) => {
      setLoading(false);
    });
  }

  function renderButtonLoadMore() {
    return (
      isShowLoadMore && (
        <div className="text-center">
          <Button type="primary" size="large" loading={loading} onClick={handleBtnLoadMore}>
            {t('watchMore')}
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
