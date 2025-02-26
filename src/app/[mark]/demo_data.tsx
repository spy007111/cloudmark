// export const NAV_DATA: NavData[] = [
//     {
//       title: '常用工具',
//       items: [
//         // {
//         //   icon: 'https://caniuse.com/img/favicon-128.png',
//         //   title: 'Can I use',
//         //   desc: '前端 API 兼容性查询',
//         //   link: 'https://caniuse.com',
//         // },
//       ],
//     },
//     {
//       title: 'AI 相关',
//       items: [
//         {
//           icon: '/icons/chatgpt.png',
//           title: 'ChatGPT',
//           link: 'https://chat.openai.com/chat',
//         },
//         {
//           icon: 'https://www.deepseek.com/favicon.ico',
//           title: 'Deepseek',
//           link: 'https://chat.deepseek.com',
//         },
//         {
//           icon: 'https://grok.com/icon-192x192.png',
//           title: 'Grok',
//           link: 'https://grok.com',
//         },
//         {
//           icon: 'https://devv.ai/favicon-light.png',
//           title: 'Devv AI',
//           desc: 'Devv AI代码搜索',
//           link: 'https://devv.ai/zh',
//         },
//         {
//           icon: 'https://metaso.cn/favicon.ico',
//           title: 'Metaso AI',
//           desc: '秘塔AI搜索',
//           link: 'https://metaso.cn',
//         },
//       ],
//     },
//     {
//       title: '流行趋势',
//       items: [
//         {
//           icon: 'https://ph-static.imgix.net/ph-favicon-brand-500.ico',
//           title: 'Product Hunt',
//           desc: '发现新产品和创业公司',
//           link: 'https://www.producthunt.com',
//         },
//         {
//           icon: 'https://openalternative.co/favicon.png',
//           title: 'Open Alternative',
//           desc: '发现流行软件的开源替代品',
//           link: 'https://openalternative.co/?sort=publishedAt.desc',
//         },
//         {
//           icon: 'https://startupfa.me/favicon.ico',
//           title: 'Startup Frame',
//           desc: 'Explore the best trending startups & products on the internet.',
//           link: 'https://startupfa.me/',
//         },
//         {
//           icon: 'https://trendshift.io/favicon.ico',
//           title: 'Trendshift',
//           desc: '查看Github的流行趋势',
//           link: 'https://trendshift.io/?trending-range=7',
//         },
//       ],
//     },
//     {
//       title: '新闻网站',
//       items: [
//         {
//           icon: 'https://www.buzzing.cc/favicon.ico?v=20230310',
//           title: 'Buzzing',
//           desc: '聚合各个国外平台的新闻',
//           link: 'https://www.buzzing.cc',
//         },
//         {
//           icon: 'https://momoyu.cc/icon-192.png',
//           title: '摸摸鱼',
//           desc: '国内新闻热搜',
//           link: 'https://momoyu.cc',
//         },
//       ],
//     },
//     {
//       title: '逛逛论坛',
//       items: [
//         {
//           icon: 'https://www.v2ex.com/static/icon-196.png',
//           title: 'V2EX',
//           desc: '创意工作者们的社区',
//           link: 'https://www.v2ex.com',
//         },
//         {
//           icon: 'https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png',
//           title: 'linux.do',
//           desc: '搞七捻三的技术论坛',
//           link: 'https://linux.do',
//         },
//       ],
//     },
//   ]

import { BookmarksData } from "@/lib/types";

// 演示用的书签数据
export const DEMO_BOOKMARKS_DATA: BookmarksData = {
  mark: "demo",
  categories: ["AI工具", "开发工具", "学习资源", "设计资源", "新闻资讯"],
  bookmarks: [
    {
      url: "https://chat.openai.com",
      title: "ChatGPT",
      favicon: "https://chat.openai.com/favicon.ico",
      createdAt: new Date(2023, 0, 1).toISOString(),
      modifiedAt: new Date(2023, 0, 1).toISOString(),
      category: "AI工具",
      description: "OpenAI开发的对话式人工智能助手",
    },
    {
      url: "https://github.com",
      title: "GitHub",
      favicon: "https://github.com/favicon.ico",
      createdAt: new Date(2023, 0, 2).toISOString(),
      modifiedAt: new Date(2023, 0, 2).toISOString(),
      category: "开发工具",
      description: "全球最大的代码托管平台",
    },
    {
      url: "https://reactjs.org",
      title: "React",
      favicon: "https://reactjs.org/favicon.ico",
      createdAt: new Date(2023, 0, 3).toISOString(),
      modifiedAt: new Date(2023, 0, 3).toISOString(),
      category: "开发工具",
      description: "用于构建用户界面的JavaScript库",
    },
    {
      url: "https://nextjs.org",
      title: "Next.js",
      favicon: "https://nextjs.org/favicon.ico",
      createdAt: new Date(2023, 0, 4).toISOString(),
      modifiedAt: new Date(2023, 0, 4).toISOString(),
      category: "开发工具",
      description: "React框架，用于生产环境的应用",
    },
    {
      url: "https://www.coursera.org",
      title: "Coursera",
      favicon: "https://www.coursera.org/favicon.ico",
      createdAt: new Date(2023, 0, 5).toISOString(),
      modifiedAt: new Date(2023, 0, 5).toISOString(),
      category: "学习资源",
      description: "提供来自世界各地大学的在线课程",
    },
    {
      url: "https://www.figma.com",
      title: "Figma",
      favicon: "https://www.figma.com/favicon.ico",
      createdAt: new Date(2023, 0, 6).toISOString(),
      modifiedAt: new Date(2023, 0, 6).toISOString(),
      category: "设计资源",
      description: "基于浏览器的界面设计工具",
    },
    {
      url: "https://news.ycombinator.com",
      title: "Hacker News",
      favicon: "https://news.ycombinator.com/favicon.ico",
      createdAt: new Date(2023, 0, 7).toISOString(),
      modifiedAt: new Date(2023, 0, 7).toISOString(),
      category: "新闻资讯",
      description: "专注于计算机科学和创业的社交新闻网站",
    },
    {
      url: "https://claude.ai",
      title: "Claude AI",
      favicon: "https://claude.ai/favicon.ico",
      createdAt: new Date(2023, 0, 8).toISOString(),
      modifiedAt: new Date(2023, 0, 8).toISOString(),
      category: "AI工具",
      description: "Anthropic开发的AI助手",
    },
    {
      url: "https://www.midjourney.com",
      title: "Midjourney",
      favicon: "https://www.midjourney.com/favicon.ico",
      createdAt: new Date(2023, 0, 9).toISOString(),
      modifiedAt: new Date(2023, 0, 9).toISOString(),
      category: "AI工具",
      description: "AI图像生成工具",
    },
    {
      url: "https://tailwindcss.com",
      title: "Tailwind CSS",
      favicon: "https://tailwindcss.com/favicon.ico",
      createdAt: new Date(2023, 0, 10).toISOString(),
      modifiedAt: new Date(2023, 0, 10).toISOString(),
      category: "开发工具",
      description: "功能类优先的CSS框架",
    },
  ],
};
