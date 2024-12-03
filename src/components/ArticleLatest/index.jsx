import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatest } from '../../store/postSlice';
import ArticleItem from '../ArticleItem';
import MainTitle from '../shared/MainTitle';
import './latest-news-list.css';
import { useTranslation } from 'react-i18next';

function ArticleLatest() {
  // dung useSelector lay du lieu tu store
  const posts = useSelector((state) => state.POST.postLatest);
  const lang = useSelector((state) => state.POST.lang);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchLatest({ lang }));
  }, [lang]);

  return (
    <div className="latest-news section">
      <div className="tcl-container">
        <MainTitle>{t('newPosts')}</MainTitle>
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
