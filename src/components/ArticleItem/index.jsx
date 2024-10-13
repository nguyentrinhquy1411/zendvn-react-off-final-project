import cls from 'classnames';
import './article-item.css';
import ArticleItemCategories from './ArticleItemCategories';
import ArticleItemDesc from './ArticleItemDesc';
import ArticleItemInfo from './ArticleItemInfo';
import ArticleItemStats from './ArticleItemStats';
import ArticleItemThumb from './ArticleItemThumb';
import ArticleItemTitle from './ArticleItemTitle';

export default function ArticleItem({
  isStyleRow = false,
  isStyleCard = false,
  isShowDesc = false,
  isShowCategories = false,
  isShowAvatar = true,
  data,
}) {
  const classes = cls('article-item', {
    'style-card': isStyleCard,
    'style-row': isStyleRow,
  });

  if (!data) return <></>;

  const { thumb: url, title, authorData: author, description, categoryIds, publishDate, slug } = data;

  // 4. lay category tu data

  return (
    <article className={classes}>
      <ArticleItemThumb thumb={url} />
      <div className="article-item__content">
        {/* 5. truyen du lieu category vào component */}
        {isShowCategories && <ArticleItemCategories categoryIds={categoryIds} />}
        {isShowCategories && <ArticleItemStats />}

        <ArticleItemTitle title={title} slug={slug} />

        {isShowDesc && <ArticleItemDesc desc={description} />}

        <ArticleItemInfo isShowAvatar={isShowAvatar} author={author} date={publishDate} />
      </div>
    </article>
  );
}
