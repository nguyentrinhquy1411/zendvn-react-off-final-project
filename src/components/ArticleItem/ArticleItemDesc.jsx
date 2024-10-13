export default function ArticleItemDesc({ desc }) {
  let descFormatted = desc.replace('<p>', '').replace('</p>', '');
  let arrDesc = descFormatted.split(' ');
  if (arrDesc.length > 20) {
    descFormatted = arrDesc.slice(0, 20).join(' ') + '...';
  }
  // split string on comma space
  return <p className="article-item__desc">{descFormatted}</p>;
}
