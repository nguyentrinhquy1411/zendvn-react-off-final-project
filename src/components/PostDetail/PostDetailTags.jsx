import { Link } from 'react-router-dom';

function PostDetailTags({ categories }) {
  return (
    <div className="post-detail__tags">
      <h2>Tags</h2>
      <ul>
        {categories.map((item, idx) => (
          <li className="item" key={idx}>
            <Link to={`/category/${item.name}`} className="btn btn-default">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostDetailTags;
