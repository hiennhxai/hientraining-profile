export type Language = 'en' | 'vi';

export type ArticleCategory = 'livestream' | 'lighting' | 'audio' | 'mc' | 'skills' | 'kienthuc' | 'setup';


export interface StatItem {
  v: string;
  l: string;
}

export type BodyBlock = 
  | { t: 'p'; c: string }
  | { t: 'h'; sn?: string; c: string }
  | { t: 'quote'; c: string }
  | { t: 'stat'; items: StatItem[] }
  | { t: 'list'; items: string[] }
  | { t: 'img'; url: string; caption?: string };

export interface ArticleTranslation {
  title: string;
  dek: string;
  role?: string;
  readTime: string;
  context?: string;
  coverImage?: string;
  blocks?: any[];
  body?: BodyBlock[];
}

export interface Article {
  slug: string;
  cat: ArticleCategory;
  date: string;
  author: string;
  initials: string;
  tags: string[];
  excerpt?: string;
  title?: string;
  coverImage?: string;
  readTime?: string;
  category?: string;
  blocks?: any[];
  en: ArticleTranslation;
  vi: ArticleTranslation;
}

export interface CourseLesson {
  lessonTitle: string;
  duration?: string;
  points: string[];
}

export interface CourseItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  formatOffline: string;
  formatOnline: string;
  feeNotice: string;
  duration: string;
  badge: string;
  lessons: CourseLesson[];
  bgImage?: string;
  bannerImage?: string;
}

export interface ProjectCategoryItem {
  title: string;
  links: { label: string; url: string; note?: string }[];
}

export interface SocialMediaChannel {
  id: string;
  title: string;
  handle?: string;
  followers?: string;
  channelUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  links: { label: string; url: string }[];
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  label: string;
  url: string;
  iconName?: string;
}

export interface ServiceItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  tags: string;
  thumbnailUrl?: string;
  galleryPhotos?: string[];
}

export interface PhotoAlbumItem {
  id: string;
  name: string;
  url: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  createdAt: string;
  caption?: string;
  folder?: string;
}

export interface BrandLogoItem {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  icon?: string;
  color?: string;
}

export type ResourceCategory = 'script' | 'template' | 'ebook' | 'software' | 'setup_guide';
export type ResourceFileType = 'PDF' | 'DOCX' | 'XLSX' | 'DRIVE' | 'ZIP' | 'LINK';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  cat: ResourceCategory;
  fileType: ResourceFileType;
  fileUrl: string;
  logoUrl?: string;
  date: string;
  fileSize?: string;
  tags?: string[];
  accessNote?: string;
}
