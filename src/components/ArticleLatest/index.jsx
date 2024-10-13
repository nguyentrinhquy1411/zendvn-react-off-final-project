import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatest } from '../../store/postSlice';
import ArticleItem from '../ArticleItem';
import MainTitle from '../shared/MainTitle';
import './latest-news-list.css';

function ArticleLatest() {
  // dung useSelector lay du lieu tu store
  const posts = useSelector((state) => state.POST.postLatest);
  const dispatch = useDispatch();
  console.log(posts);

  useEffect(() => {
    dispatch(fetchLatest());
  }, []);

  return (
    <div className="latest-news section">
      <div className="tcl-container">
        <MainTitle>Bài viết mới</MainTitle>
        <div className="latest-news__list spacing">
          {posts.map((item, index) => (
            <div className="latest-news__card" key={index}>
              <ArticleItem data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArticleLatest;
