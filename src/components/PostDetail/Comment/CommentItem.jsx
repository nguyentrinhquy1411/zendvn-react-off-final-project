import React from 'react';

function CommentItem(props) {
  return (
    <li className="item">
      <div className="comments__section">
        <div className="comments__section--avatar">
          <a href="/">
            <img src="/assets/images/avatar3.jpg" alt="" />
          </a>
        </div>
        <div className="comments__section--content">
          <a href="/" className="comments__section--user">
            John Smith
          </a>
          <p className="comments__section--time">2 minutes ago</p>
          <p className="comments__section--text">Lorem ipsum dolor sit, amet?</p>
          {/* <i class="ion-reply comments__section--reply"></i> */}
        </div>
      </div>
      {/* Reply Comments */}
      {/* Reply form */}
      <div className="comments__hidden">
        <a href="/">
          <i className="icons ion-ios-undo" /> Xem thêm 2 câu trả lời
        </a>
      </div>
    </li>
  );
}

export default CommentItem;
