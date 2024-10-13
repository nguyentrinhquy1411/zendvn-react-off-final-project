import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../../store/commentSlice';
import CommentItem from './CommentItem';
import './comments.css';
import './my-custom.css';
import { Link } from 'react-router-dom';
import CommentForm from './Comment/CommentForm';

function PostDetailComments({ id }) {
  const dispatch = useDispatch();
  const {
    list: data,
    commentRemain,
    totalpages: totalPages,
    currentPage,
  } = useSelector((state) => state.COMMENT.postComments);
  const currentUser = useSelector((state) => state.AUTH.currentUser);
  const isShowLoadMore = commentRemain > 0;

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
          Vui lòng <Link to={'/login'}>đăng nhập</Link> để bình luận!!
        </p>
      )}
      <p>20 Comments</p>
      <ul className="comments">
        {/* Comment 3 */}
        {data.map((item, idx) => {
          let authorThumb = null;
          if (item.authorThumb) {
            authorThumb = item.authorThumb['96'];
          } else {
            authorThumb = `../assets/images/avatar1.jpg`;
          }
          return <CommentItem item={item} key={idx} authorThumb={authorThumb} author={currentUser} id={id} />;
        })}
      </ul>
      {isShowLoadMore && (
        <div className="comments__hidden parent">
          <a href="#" onClick={handleLoadMore}>
            <i className="icons ion-ios-undo" /> Xem thêm {commentRemain} binh luan
          </a>
        </div>
      )}
    </div>
  );
}

export default PostDetailComments;
