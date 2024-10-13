import { useSelector } from 'react-redux';
import './post-detail.css';
import PostDetailComments from './PostDetailComments';
import PostDetailRichText from './PostDetailRichText';
import PostDetailTags from './PostDetailTags';

function PostDetailContent({ url, content, id }) {
  const categories = useSelector((state) => state.CATEGORY.list);

  return (
    <div className="post-detail__content">
      <div className="thumbnail">
        <img src={url} alt="blog-title" />
      </div>
      <div className="content-padding">
        <PostDetailRichText content={content} />

        <PostDetailTags categories={categories} />

        <PostDetailComments id={id} />
      </div>
    </div>
  );
}

export default PostDetailContent;
