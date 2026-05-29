export type InstagramPost = {
  id: string;
  shortcode: string;
  permalink: string;
  caption: string;
  images: string[];
  thumbnail: string;
  isCarousel: boolean;
  syncedAt: string;
};

export type InstagramFeed = {
  username: string;
  profileUrl: string;
  syncedAt: string;
  posts: InstagramPost[];
};
