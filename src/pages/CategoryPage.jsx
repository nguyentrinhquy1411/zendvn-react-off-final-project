import { useParams } from 'react-router-dom';
import ArticleItem from '../components/ArticleItem';
import Button from '../components/shared/Button';
import MainTitle from '../components/shared/MainTitle';
import { fetchByCategory } from '../store/postSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function CategoryPage() {
  const {
    list: posts,
    totalpages: totalPages,
    currentPage,
    total,
  } = useSelector((state) => state.POST.postsByCategory);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const dispatch = useDispatch();

  const isShowLoadMore = currentPage < totalPages;

  useEffect(() => {
    dispatch(fetchByCategory({ currentPage: 1, slug })).then((res) => {
      setLoading(false);
    });
  }, [slug]);

  function handleBtnLoadMore() {
    setLoading(true);
    dispatch(fetchByCategory({ currentPage: currentPage + 1, slug })).then((res) => {
      setLoading(false);
    });
  }

  return (
    <div className="articles-list section">
      <div className="tcl-container">
        <MainTitle>
          Category: {slug}, có {total} bài viết
        </MainTitle>

        <div className="tcl-row tcl-jc-center">
          {posts.map((item, idx) => (
            <div className="tcl-col-12 tcl-col-md-8" key={idx}>
              <ArticleItem isStyleCard isShowCategories isShowAvatar={false} isShowDesc={false} data={item} />
            </div>
          ))}
        </div>

        {isShowLoadMore && (
          <div className="text-center">
            <Button type="primary" size="large" onClick={handleBtnLoadMore} loading={loading}>
              Tải thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
