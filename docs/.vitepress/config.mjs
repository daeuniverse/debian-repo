import { defineConfig } from 'vitepress'
import { locales } from './locales.mjs'
import upstream from './upstream.json' with { type: 'json' }

const organizationUrl = 'https://github.com/daeuniverse'
// Edit links resolve inside this repository; the footer and the social link address the
// organization, which is what a reader following "GitHub" is looking for.
const repositoryUrl = `${organizationUrl}/repo-for-linux`
const base = process.env.DOCS_BASE || '/'

function pageLocale(relativePath) {
  return Object.values(locales).find(locale => locale.prefix &&
    (relativePath.startsWith(locale.prefix.slice(1) + '/') || relativePath.startsWith(`dae/${locale.lang}/`) || relativePath.startsWith(`daed/${locale.lang}/`))) || locales.root
}

function localeConfig({ lang, label, prefix, description, labels: t, theme }) {
  const pages = upstream.entries.filter(entry => entry.locale === lang)
  const manualItems = section => pages
    .filter(entry => section ? entry.topic.startsWith(`${section}/`) : !entry.topic.includes('/'))
    .map(entry => ({ text: entry.title, link: `${prefix}/dae/${entry.path.split('/').slice(2).join('/').replace(/\.md$/, '').replace(/^index$/, '').replace(/\/index$/, '/')}` }))
  const installation = {
    text: t.installation, link: `${prefix}/dae/installation/`,
    items: [
      { text: 'Arch Linux / Manjaro', link: `${prefix}/dae/installation/arch` },
      { text: t.debian, link: `${prefix}/dae/installation/debian` },
      { text: t.fedora, link: `${prefix}/dae/installation/fedora` },
      { text: t.opensuse, link: `${prefix}/dae/installation/opensuse` },
      { text: t.gentoo, link: `${prefix}/dae/installation/gentoo` },
      { text: 'Nix / NixOS', link: `${prefix}/dae/installation/nix` },
      { text: 'Docker', link: `${prefix}/dae/installation/docker` },
      ...manualItems('tutorials'),
      { text: t.manualInstall, link: `${prefix}/dae/installation/manual-installation` }
    ]
  }
  return {
    lang, label, description,
    link: `${prefix}/`,
    themeConfig: {
      ...theme,
      editLink: { text: t.edit, pattern: process.env.DOCS_EDIT_URL || `${repositoryUrl}/edit/main/docs/:path` },
      nav: [
        { text: t.manual, link: `${prefix}/dae/` },
        { text: t.development, link: `${prefix}/dae/development/contribute` }
      ],
      sidebar: [
        {
          text: pages.find(entry => entry.topic === 'README.md').title,
          collapsed: false,
          items: [
            { text: t.overview, link: `${prefix}/dae/` },
            { text: t.requirements, link: `${prefix}/dae/start/requirements` },
            installation,
            { text: t.minimalConfiguration, link: `${prefix}/dae/start/minimal-configuration` },
            { text: t.serviceManagement, link: `${prefix}/dae/start/service-management` },
            { text: t.pppoe, link: `${prefix}/dae/start/pppoe` }
          ]
        },
        { text: t.concepts, collapsed: false, items: manualItems('').filter(item =>
          item.link !== `${prefix}/dae/` && item.link !== `${prefix}/dae/troubleshooting`) },
        { text: t.userGuide, collapsed: false, items: [
          ...manualItems('user-guide'),
          ...manualItems('').filter(item => item.link === `${prefix}/dae/troubleshooting`)
        ] },
        { text: t.configuration, collapsed: false, items: manualItems('configuration') },
        { text: 'daed', collapsed: false, items: [
          { text: 'daed', link: `${prefix}/daed/` },
          { text: 'Arch Linux / Manjaro', link: `${prefix}/daed/installation/arch` },
          { text: t.debian, link: `${prefix}/daed/installation/debian` },
          { text: t.fedora, link: `${prefix}/daed/installation/fedora` },
          { text: t.opensuse, link: `${prefix}/daed/installation/opensuse` },
          { text: t.gentoo, link: `${prefix}/daed/installation/gentoo` },
          { text: 'Nix / NixOS', link: `${prefix}/daed/installation/nix` },
          { text: t.serviceManagement, link: `${prefix}/daed/service-management` }
        ] },
        { text: t.otherSoftware, collapsed: false, items: [
          { text: t.packageList, link: `${prefix}/guide/packages` },
          { text: t.debian, link: `${prefix}/guide/packages/debian` },
          { text: t.fedora, link: `${prefix}/guide/packages/fedora` },
          { text: t.opensuse, link: `${prefix}/guide/packages/opensuse` },
          { text: t.gentoo, link: `${prefix}/guide/packages/gentoo` },
          { text: 'Arch Linux / Manjaro', link: `${prefix}/guide/packages/arch` }
        ] },
        { text: t.experimental, collapsed: false, items: [
          { text: 'honk', link: `${prefix}/honk` },
          { text: 'kdae', link: `${prefix}/kdae` }
        ] },
        { text: t.development, collapsed: false, items: manualItems('development') },
        { text: t.reference, items: [
          { text: t.services, link: `${prefix}/guide/maintenance` }
        ] }
      ],
      outline: { level: [2, 3], label: t.outline },
      docFooter: { prev: t.previous, next: t.next }
    }
  }
}

export default defineConfig({
  title: 'Dae Universe',
  lastUpdated: true,
  base,
  head: [['link', { rel: 'icon', type: 'image/png', href: `${base}daeuniverse-favicon.png` }]],
  cleanUrls: process.env.DOCS_CLEAN_URLS !== 'false',
  appearance: true,
  srcExclude: ['DESIGN.md'],
  rewrites: {
    'daed/en-US/:rest*': 'daed/:rest*',
    'daed/zh-CN/:rest*': 'zh-CN/daed/:rest*',
    'daed/zh-TW/:rest*': 'zh-TW/daed/:rest*',
    'dae/en-US/:rest*': 'dae/:rest*',
    'dae/zh-CN/:rest*': 'zh-CN/dae/:rest*',
    'dae/zh-TW/:rest*': 'zh-TW/dae/:rest*'
  },
  outDir: process.env.DOCS_OUT_DIR || './.vitepress/dist',
  cacheDir: process.env.DOCS_CACHE_DIR || './.vitepress/cache',
  sitemap: { hostname: process.env.DOCS_SITE_URL || 'https://daeuniverse.pages.dev' },
  locales: Object.fromEntries(Object.entries(locales).map(([key, locale]) => [key, localeConfig(locale)])),
  markdown: {
    config(md) {
      const fence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, index, options, env, renderer) => {
        const title = md.utils.escapeHtml(pageLocale(env.relativePath || '').labels.copy)
        return fence(tokens, index, options, env, renderer).replace('title="Copy Code"', `title="${title}"`)
      }
      const linkOpen = md.renderer.rules.link_open
      md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
        const html = linkOpen ? linkOpen(tokens, index, options, env, renderer) : renderer.renderToken(tokens, index, options)
        const label = md.utils.escapeHtml(pageLocale(env.relativePath || '').labels.permalink)
        return html.replace('aria-label="Permalink to ', `aria-label="${label} `)
      }
    }
  },
  transformHead({ pageData }) {
    const { copied } = pageLocale(pageData.relativePath).labels
    return [['style', {}, `:root { --vp-code-copy-copied-text-content: ${JSON.stringify(copied)}; }`]]
  },
  themeConfig: {
    siteTitle: 'Dae Universe',
    footer: { message: `Dae Universe · <a href="${organizationUrl}">GitHub</a>` },
    logo: { src: '/daeuniverse.png', alt: 'Dae Universe' },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text) => Array.from(new Intl.Segmenter('en', { granularity: 'word' }).segment(text))
              .filter(segment => segment.isWordLike).map(segment => segment.segment)
          }
        },
        locales: Object.fromEntries(Object.entries(locales)
          .filter(([, locale]) => locale.search)
          .map(([key, locale]) => [key, { translations: locale.search }]))
      }
    },
    socialLinks: [{ icon: 'github', link: organizationUrl }]
  }
})
