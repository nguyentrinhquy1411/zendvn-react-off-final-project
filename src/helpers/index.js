export function mappingPostData(item) {
  return {
    id: item.id,
    publishDate: item['date'],
    slug: item['slug'],
    title: item.title.rendered,
    description: item.excerpt.rendered,
    thumb: item.featured_media_url,
    authorData: {
      id: item.author,
      nickname: item.author_data.nickname,
      description: item.author_data.description,
      avatar: item.author_data.avatar,
    },
    // 1. lay categories
    categoryIds: item.categories,
    tagsIds: item.tags,
    content: item.content.rendered,
    status: item.status,
  };
}

export function mappingCategoryData(item) {
  return {
    key: item.id,
    id: item.id,
    slug: item.slug,
    name: item.name,
    parent: item.parent,
  };
}

export function mappingMenuData(item) {
  let childItems = item?.child_items ? item?.child_items.map(mappingMenuData) : null;

  return {
    id: item.ID,
    title: item.title,
    childItems: childItems,
  };
}

export function mappingCommentData(item) {
  // let childItems = item?.child_items ? item?.child_items.map(mappingMenuData) : null;
  console.log(item);

  return {
    idComment: item.id,
    authorNickname: item.author_data.nickname,
    authorThumb: item.author_avatar_urls,
    publishDate: item.date,
    content: item.content.rendered,
    replyCount: item.comment_reply_count,
    parent: item.parent,
  };
}

export function mappingProfileData(item) {
  return {
    file: item.simple_local_avatar.full,
    id: item.id,
    email: item.email,
    nickname: item.nickname,
    firstName: item.first_name,
    lastName: item.last_name,
    description: item.description,
  };
}
export function mappingTagsData(item) {
  return {
    id: item.id,
    name: item.name,
  };
}

export function mappingUsersData(item) {
  return {
    id: item.id,
    nickname: item.nickname,
    email: item.email,
    username: item.user_name,
  };
}
