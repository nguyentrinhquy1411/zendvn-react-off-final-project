import { useParams } from 'react-router-dom';
import PostDetailContent from '../components/PostDetail/PostDetailContent';
import PostDetailHead from '../components/PostDetail/PostDetailHead';
import PostDetailSidebar from '../components/PostDetail/PostDetailSidebar';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetail } from '../store/postSlice';
import IconLoading from '../components/shared/IconLoading';

function PostDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.POST.postDetail);

  useEffect(() => {
    dispatch(fetchDetail({ slug }));
  }, [slug]);

  if (!data) {
    return (
      <div className="text-center">
        <IconLoading width={150}></IconLoading>;
      </div>
    );
  }

  const { thumb: url, title, authorData, content, publishDate, id } = data;

  return (
    <main className="post-detail">
      <div className="spacing" />

      <PostDetailHead title={title} date={publishDate} authorName={authorData.nickname} />

      <div className="spacing" />

      <div className="post-detail__fluid">
        <div className="tcl-container">
          <div className="post-detail__wrapper">
            <PostDetailContent url={url} content={content} id={id} />

            <PostDetailSidebar author={authorData} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default PostDetailPage;
