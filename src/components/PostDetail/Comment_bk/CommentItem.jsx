import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildComments } from '../../store/commentSlice';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentForm from './Comment/CommentForm';

// Extend with relativeTime plugin first
dayjs.extend(relativeTime);

// Set the locale after extending
dayjs.locale('vi');

function CommentItem({ item, authorThumb, author, id }) {
  const { publishDate, authorNickname, content, replyCount, idComment } = item;
  const currentUser = useSelector((state) => state.AUTH.currentUser);
  const dateFormatted = dayjs(publishDate).fromNow();
  const [isShowReplyForm, setIsShowReplyForm] = useState(false);

  const dispatch = useDispatch();
  const articleId = useSelector((state) => state.POST.postDetail.id);
  const { list, currentPage, commentRemain } = useSelector((state) => state.COMMENT.commentChildData);
  console.log('list', list);

  const childComments = list.filter((childItem) => childItem.parent === idComment);
  const isShowLoadMore = replyCount - childComments.length > 0;
  let comments = replyCount;

  if (commentRemain !== 0) {
    comments = commentRemain === replyCount ? replyCount : commentRemain;
  }

  function handleLoadChildComments(e) {
    e.preventDefault();
    dispatch(fetchChildComments({ perPage: 2, parent: idComment, articleId, currentPage: currentPage + 1 }));
  }

  function toggleCommentForm(e) {
    e.preventDefault();
    setIsShowReplyForm(!isShowReplyForm);
  }

  return (
    <li className="item">
      <div className="comments__section">
        <div className="comments__section--avatar">
          <a href="/">
            <img src={authorThumb} alt={authorNickname} />
          </a>
        </div>
        <div className="comments__section--content">
          <a href="/" className="comments__section--user">
            {authorNickname || currentUser.nickname}
          </a>
          <p className="comments__section--time">{dateFormatted || 'Vừa xong'}</p>
          <div className="comments__section--text" dangerouslySetInnerHTML={{ __html: content }}></div>
          <i className="ion-reply comments__section--reply" onClick={toggleCommentForm}></i>
        </div>
      </div>
      {isShowReplyForm && <CommentForm id={id} author={currentUser} parent={idComment} />}
      {/* Reply Comments */}
      {childComments.length > 0 && (
        <ul className="comments">
          {childComments.map((childItem, idx) => (
            <CommentItem item={childItem} key={idx} />
          ))}
        </ul>
      )}
      {/* Reply form */}
      {isShowLoadMore && (
        <div className="comments__hidden">
          <a href="#" onClick={handleLoadChildComments}>
            <i className="icons ion-ios-undo" /> Xem thêm {comments} câu trả lời
          </a>
        </div>
      )}
    </li>
  );
}

export default CommentItem;
