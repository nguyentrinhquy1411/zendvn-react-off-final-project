import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
// Extend with relativeTime plugin first
dayjs.extend(relativeTime);

// Set the locale after extending
dayjs.locale('vi');

function PostDetailHead({ date, title, authorName }) {
  const dateFormatted = dayjs(date).fromNow();

  return (
    <div className="post-detail__head">
      <div className="tcl-container">
        <h1 className="post-detail__title">{title}</h1>
        <ul className="post-detail__info">
          <li className="item author">
            By{' '}
            <a href="/">
              <strong>{authorName}</strong>
            </a>
          </li>
          <li className="item date">{dateFormatted}</li>
          {/* <li className="item views">
            2 <i className="icons ion-ios-eye" />
          </li>
          <li className="item comments">
            20 <i className="icons ion-ios-chatbubble" />
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export default PostDetailHead;
