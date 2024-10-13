import './post-author.css';

function PostDetailAuthor({ authorInfo }) {
  const name = authorInfo.nickname;
  const description = authorInfo.description;
  const avatar = authorInfo.avatar;
  return (
    <div className="post-author">
      <div className="post-author__bg-avatar">
        <a href="/" className="post-author__avatar">
          <img src={avatar} alt="" />
        </a>
      </div>
      <div className="post-author__nickname">
        <a href="/">{name}</a>
      </div>
      <p className="post-author__desc">{description}</p>
    </div>
  );
}

export default PostDetailAuthor;
