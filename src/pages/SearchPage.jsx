import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ArticleItem from '../components/ArticleItem';
import Button from '../components/shared/Button';
import MainTitle from '../components/shared/MainTitle';
import { fetchPaging } from '../store/postSlice';
import usePostPaging from '../hooks/usePostPaging';

function SearchPage() {
  // lay duoc gia tri search 'q' tren url
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q');
  const extraParams = { per_page: 1, search };
  const { posts, renderButtonLoadMore, total } = usePostPaging(extraParams);
  const dispatch = useDispatch();

  // useEffect -> kich hoat action lay bai viet theo tu khoa
  useEffect(() => {
    dispatch(fetchPaging({ page: 1, ...extraParams }));
  }, [search]);

  return (
    <div className="articles-list section">
      <div className="tcl-container">
        <MainTitle type="search">
          {total} kết quả tìm kiếm với từ khóa "{search}"
        </MainTitle>

        <div className="tcl-row tcl-jc-center">
          {posts.map((item, idx) => (
            <div className="tcl-col-12 tcl-col-md-8" key={idx}>
              <ArticleItem isStyleCard isShowCategories isShowAvatar={false} isShowDesc={false} data={item} />
            </div>
          ))}
        </div>

        {renderButtonLoadMore()}
      </div>
    </div>
  );
}

export default SearchPage;
