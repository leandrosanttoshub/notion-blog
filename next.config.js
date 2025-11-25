const fs = require('fs')
const path = require('path')

const {
  NOTION_TOKEN,
  BLOG_INDEX_ID,
} = require('./src/lib/notion/server-constants')

// Limpa caches antigos do Notion
try {
  fs.unlinkSync(path.resolve('.blog_index_data'))
} catch (_) {}
try {
  fs.unlinkSync(path.resolve('.blog_index_data_previews'))
} catch (_) {}

const warnOrError =
  process.env.NODE_ENV !== 'production'
    ? console.warn
    : (msg) => {
        throw new Error(msg)
      }

if (!NOTION_TOKEN) {
  warnOrError(
    `\nNOTION_TOKEN is missing from env, this will result in an error\n` +
      `Make sure to provide one before starting Next.js`
  )
}

if (!BLOG_INDEX_ID) {
  warnOrError(
    `\nBLOG_INDEX_ID is missing from env, this will result in an error\n` +
      `Make sure to provide one before starting Next.js`
  )
}

// Transpilar módulos modernos do Notion
const withTM = require('next-transpile-modules')([
  'react-notion-x',
  'notion-client',
  'notion-utils',
  'react-image',
  'react-intersection-observer'
])

module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,

  webpack(cfg, { dev, isServer }) {
    // Removido: build-rss (era o causador do erro)
    // Não carregamos mais ./src/lib/build-rss.ts

    return cfg
  }
})
