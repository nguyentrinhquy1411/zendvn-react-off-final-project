import { useSelector } from 'react-redux';
import PostDetailAuthor from './PostDetailAuthor';
import PostDetailRelatedPosts from './PostDetailRelatedPosts';

function PostDetailSidebar({ author }) {
  const posts = useSelector((state) => state.POST.postRelated);

  return (
    <div className="post-detail__side">
      <PostDetailAuthor authorInfo={author} />
      <div className="spacing" />
      <PostDetailRelatedPosts data={posts} />
    </div>
  );
}

export default PostDetailSidebar;
