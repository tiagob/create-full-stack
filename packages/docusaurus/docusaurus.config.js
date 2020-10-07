module.exports = {
  title: "Create Full Stack",
  tagline:
    "Set up a TypeScript full stack (web, mobile, backend, aws) with one command",
  url: "https://create-full-stack.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "tiagob",
  projectName: "create-full-stack",
  themeConfig: {
    gtag: {
      trackingID: "UA-179528483-1",
    },
    navbar: {
      title: "Create Full Stack",
      logo: {
        alt: "Create Full Stack",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/tiagob/create-full-stack",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Made with ❤️ by",
          items: [
            {
              label: "🐦 @tiagsters",
              href: "https://twitter.com/tiagsters",
            },
            {
              label: "👨‍💻 @tiagob",
              href: "https://github.com/tiagob/",
            },
          ],
        },
      ],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/tiagob/create-full-stack/edit/master/packages/docusaurus/",
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/tiagob/create-full-stack/edit/master/packages/docusaurus/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
