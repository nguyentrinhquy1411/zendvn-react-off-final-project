import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchNewChildComment, fetchNewComment } from '../../../store/commentSlice';

function CommentForm({ id, author, parent }) {
  const [data, setData] = useState({
    author: author.id || null,
    post: id,
    content: '',
    parent: parent || 0,
  });
  const dispatch = useDispatch();

  function handleOnChange(e) {
    setData({
      ...data,
      content: e.target.value,
    });
    console.log(data.parent);
  }

  function handleSubmit() {
    if (data.parent === 0) {
      dispatch(fetchNewComment(data)).then((res) => {
        setData({ content: '' });
      });
    } else {
      dispatch(fetchNewChildComment(data)).then((res) => {
        setData({ content: '' });
      });
    }
  }

  return (
    <div className="comments__form">
      <div className="comments__form--control">
        <div className="comments__section--avatar">
          <a href="/">
            <img src="/assets/images/avatar1.jpg" alt="" />
          </a>
        </div>
        <textarea onChange={handleOnChange} value={data.content} />
      </div>
      <div className="text-right">
        <button className="btn btn-default" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default CommentForm;
