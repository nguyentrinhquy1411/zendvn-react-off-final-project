import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

// 6
export default function ArticleItemCategories({ categoryIds }) {
  const categories = useSelector((state) => state.CATEGORY.list);

  let result = [];
  categories.map((x) => {
    categoryIds.map((y) => {
      if (x.id === y) {
        result.push(x.name);
      }
    });
  });

  // 7. lay danh sach category tu store
  return (
    <ul className="article-item__categories">
      {result.map((item, idx) => (
        <li key={idx}>
          <Link to={`/category/${item}`} className="btn btn-category">
            {item}
          </Link>
        </li>
      ))}
    </ul>
  );
}
