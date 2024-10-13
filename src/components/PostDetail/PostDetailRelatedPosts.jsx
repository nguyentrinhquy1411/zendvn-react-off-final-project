import ArticleRelated from '../ArticleItem/ArticleRelated';

function PostDetailRelatedPosts({ data }) {
  return (
    <div className="related-post">
      <h2 className="related-post__head">Related Posts</h2>
      {data.map((item, idx) => {
        return <ArticleRelated item={item} key={idx} />;
      })}
    </div>
  );
}

export default PostDetailRelatedPosts;
