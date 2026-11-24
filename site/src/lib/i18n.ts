// English lives at /, Vietnamese at /vi/. Page text comes from the CMS (see content.ts);
// the fixed interface words (menu, form labels, messages) are here.
export type Lang = 'en' | 'vi';

/** Home URL for a language: "/" or "/vi/". */
export const home = (lang: Lang) => (lang === 'vi' ? '/vi/' : '/');

/** The same page in the other language, e.g. /privacy/ <-> /vi/privacy/. */
export function swapPath(pathname: string, to: Lang) {
  const bare = pathname.replace(/^\/vi(\/|$)/, '/');
  return to === 'vi' ? `/vi${bare}` : bare;
}

const statusVi: Record<string, string> = {
  Confirmed: 'Đã xác nhận',
  'In development': 'Đang phát triển',
  Proposed: 'Đề xuất',
  Concept: 'Ý tưởng',
  'Potential project': 'Dự án tiềm năng',
};
export const status = (lang: Lang, s: string) => (lang === 'vi' ? statusVi[s] || s : s);

export const ui = {
  en: {
    htmlLang: 'en-AU',
    ogLocale: 'en_AU',
    skip: 'Skip to content',
    homeLabel: 'VCACE home',
    menu: 'Menu',
    primaryNav: 'Primary',
    vision: 'Our Vision',
    programs: 'Programs',
    people: 'People & Partners',
    projects: 'Upcoming Projects',
    news: 'News',
    newsIntro: 'Announcements and updates from VCACE.',
    readMore: 'Read more',
    allNews: 'All news',
    exploreVcace: 'Explore VCACE',
    englishOnly: '',
    collaborate: 'Collaborate with us',
    language: 'Language',
    footerNav: 'Footer',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    accessibility: 'Accessibility',
    tagline: 'Connecting cultures. Inspiring exchange.',
    glance: 'VCACE at a glance',
    portrait: (name: string) => `Portrait of ${name}`,
    form: {
      name: 'Your name',
      email: 'Email',
      organisation: 'Organisation',
      optional: '(optional)',
      topic: 'What is your enquiry about?',
      choose: 'Choose one',
      message: 'Message',
      consent: 'I agree VCACE may use these details to reply to my enquiry. See the Privacy page.',
      incomplete: 'Please complete every field and tick the consent box.',
      preview: 'Preview only: the form sends on the live site, so nothing was sent from here.',
      sending: 'Sending…',
      sent: 'Thank you. Your message was sent and VCACE will reply soon.',
      failed: 'Your message was not sent. Please try again in a moment.',
    },
    draft: 'Draft for review. This wording has not yet been approved.',
    updated: 'Last updated',
    dateLocale: 'en-AU',
    thanks: {
      title: 'Message sent',
      description: 'Your enquiry was sent to VCACE.',
      lead: 'Thank you for getting in touch. VCACE will reply to your enquiry soon.',
      back: 'Back to the home page',
    },
  },
  vi: {
    htmlLang: 'vi',
    ogLocale: 'vi_VN',
    skip: 'Chuyển đến nội dung chính',
    homeLabel: 'Trang chủ VCACE',
    menu: 'Menu',
    primaryNav: 'Menu chính',
    vision: 'Tầm nhìn',
    programs: 'Chương trình',
    people: 'Con người & Đối tác',
    projects: 'Dự án sắp tới',
    news: 'Tin tức',
    newsIntro: 'Thông báo và tin cập nhật từ VCACE.',
    readMore: 'Đọc tiếp',
    allNews: 'Tất cả tin tức',
    exploreVcace: 'Khám phá VCACE',
    englishOnly: 'Bài viết bằng tiếng Anh',
    collaborate: 'Hợp tác cùng chúng tôi',
    language: 'Ngôn ngữ',
    footerNav: 'Chân trang',
    contact: 'Liên hệ',
    privacy: 'Quyền riêng tư',
    terms: 'Điều khoản',
    accessibility: 'Trợ năng',
    tagline: 'Kết nối văn hóa. Khơi nguồn giao lưu.',
    glance: 'VCACE qua những con số',
    portrait: (name: string) => `Ảnh chân dung ${name}`,
    form: {
      name: 'Họ và tên',
      email: 'Email',
      organisation: 'Tổ chức',
      optional: '(không bắt buộc)',
      topic: 'Bạn muốn liên hệ về việc gì?',
      choose: 'Chọn một mục',
      message: 'Lời nhắn',
      consent: 'Tôi đồng ý để VCACE dùng các thông tin này để trả lời tôi. Xem trang Quyền riêng tư.',
      incomplete: 'Vui lòng điền đủ các ô và đánh dấu ô đồng ý.',
      preview: 'Đây là bản xem thử: biểu mẫu chỉ gửi được trên website chính thức, nên chưa có gì được gửi đi.',
      sending: 'Đang gửi…',
      sent: 'Cảm ơn bạn. Lời nhắn đã được gửi và VCACE sẽ sớm phản hồi.',
      failed: 'Lời nhắn chưa gửi được. Vui lòng thử lại sau ít phút.',
    },
    draft: 'Bản nháp để duyệt. Nội dung này chưa được phê duyệt.',
    updated: 'Cập nhật lần cuối',
    dateLocale: 'vi-VN',
    thanks: {
      title: 'Đã gửi lời nhắn',
      description: 'Lời nhắn của bạn đã được gửi đến VCACE.',
      lead: 'Cảm ơn bạn đã liên hệ. VCACE sẽ sớm phản hồi.',
      back: 'Về trang chủ',
    },
  },
} as const;
