import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import usePostPaging from '../../hooks/usePostPaging';
import { fetchPaging } from '../../store/postSlice';
import ArticleItem from '../ArticleItem';
import MainTitle from '../shared/MainTitle';

function ArticleGeneral() {
  const extraParams = { per_page: 2 };
  const { posts, renderButtonLoadMore } = usePostPaging(extraParams);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPaging({ page: 1, ...extraParams }));
  }, []);

  return (
    <div className="articles-list section">
      <div className="tcl-container">
        {/* Main Title */}
        <MainTitle btnLabel="Xem thêm">Bài viết tổng hợp</MainTitle>
        {/* End Main Title */}
        {/* End Row News List */}
        <div className="tcl-row">
          {posts.map((item, index) => (
            <div className="tcl-col-12 tcl-col-md-6" key={index}>
              <ArticleItem isStyleCard isShowAvatar={false} data={item} />
            </div>
          ))}
        </div>
        {/* End Row News List */}
        {renderButtonLoadMore()}
      </div>
    </div>
  );
}

export default ArticleGeneral;
