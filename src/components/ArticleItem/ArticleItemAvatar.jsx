export default function ArticleItemAvatar({ avatar }) {
  return (
    <div className="article-item__author-image">
      <a aria-label="John Doe" href="/">
        <img src={avatar} alt="john-doe" />
      </a>
    </div>
  );
}
