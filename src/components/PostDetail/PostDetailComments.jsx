import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../../store/commentSlice';
import CommentItem from './CommentItem';
import './comments.css';
import './my-custom.css';
import { Link } from 'react-router-dom';
import CommentForm from './Comment/CommentForm';
import { Trans, useTranslation } from 'react-i18next';

function PostDetailComments({ id }) {
  const dispatch = useDispatch();
  const {
    list: data,
    commentRemain,
    totalpages: totalPages,
    currentPage,
    total,
  } = useSelector((state) => state.COMMENT.postComments);
  const currentUser = useSelector((state) => state.AUTH.currentUser);
  const isShowLoadMore = commentRemain > 0;
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchComments({ currentPage: 1, articleId: id }));
  }, [id, dispatch]);

  function handleLoadMore(e) {
    e.preventDefault();
    dispatch(fetchComments({ currentPage: currentPage + 1, articleId: id }));
  }

  return (
    <div className="post-detail__comments">
      {currentUser !== null ? (
        <CommentForm id={id} author={currentUser} />
      ) : (
        <p>
          <Trans i18nKey="loginPrompt">
            Vui lòng <Link to="/login">đăng nhập</Link> để bình luận!!
          </Trans>
        </p>
      )}
      <ul className="comments">
        {/* Comment 3 */}
        {data.map((item, idx) => {
          return <CommentItem item={item} key={idx} author={currentUser} id={id} />;
        })}
      </ul>
      {isShowLoadMore && (
        <div className="comments__hidden parent">
          <a href="#" onClick={handleLoadMore}>
            <i className="icons ion-ios-undo" /> {t('loadMoreComments', { commentRemain })}
          </a>
        </div>
      )}
    </div>
  );
}

export default PostDetailComments;
