import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopular } from '../../store/postSlice';
import ArticleItem from '../ArticleItem';
import MainTitle from '../shared/MainTitle';
import './popular-news-list.css';

function ArticlePopular() {
  // dung useSelector lay du lieu tu store
  const posts = useSelector((state) => state.POST.postPopular);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPopular(1, 2));
  }, []);

  return (
    <div className="popular-news section bg-white-blue">
      <div className="tcl-container">
        {/* Main Title */}
        <MainTitle btnLabel="Xem thêm">Bài viết phổ biến</MainTitle>
        {/* End Main Title */}
        <div className="popular-news__list spacing">
          <div className="popular-news__list--left">
            <div className="popular-news__list--row">
              {/* Popular news card */}
              <div className="popular-news__list--card">
                <ArticleItem isStyleCard isShowCategories isShowDesc data={posts[0]} />
              </div>
              {/* End Popular news card */}
              {/* Popular news card */}
              <div className="popular-news__list--card">
                <ArticleItem isStyleCard isShowCategories isShowDesc data={posts[1]} />
              </div>
              {/* End Popular news card */}
            </div>
          </div>
          <div className="popular-news__list--right">
            <div className="popular-news__list--row">
              {/* Popular news card */}
              <div className="popular-news__list--card">
                <ArticleItem isStyleCard isStyleRow isShowDesc data={posts[2]} />
              </div>
              {/* End Popular news card */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePopular;
