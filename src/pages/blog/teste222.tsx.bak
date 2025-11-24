import Link from 'next/link'
import fetch from 'node-fetch'
import { useRouter } from 'next/router'
import Header from '../../components/header'
import Heading from '../../components/heading'
import components from '../../components/dynamic'
import ReactJSXParser from '@zeit/react-jsx-parser'
import blogStyles from '../../styles/blog.module.css'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import { getBlogLink, getDateStr } from '../../lib/blog-helpers'
import getPage from '../../lib/notion/getPage'
import React, { CSSProperties, useEffect } from 'react'
import { NotionRenderer } from 'react-notion-x'

// Get the data for each blog post
export async function getStaticProps({ params: { slug }, preview }: any) {
  // load the postsTable so that we can get the page's ID
  const postsTable = await getBlogIndex()
  const post = postsTable[slug]

  // if we can't find the post or if it is unpublished and
  // viewed without preview mode then we just redirect to /blog
  if (!post || (post.Published !== 'Yes' && !preview)) {
    console.log(`Failed to find post for slug: ${slug}`)
    return {
      props: {
        redirect: '/blog',
        preview: false,
      },
      unstable_revalidate: 5,
    }
  }

  // novo: carregar recordMap (notion-client)
  const recordMap = await getPage(post.id)
  post.recordMap = recordMap

  // Procura blocos tweet no recordMap e tenta popular o properties.html via oEmbed (como fazia antes)
  try {
    const blocks = recordMap?.block || {}
    for (const blockId of Object.keys(blocks)) {
      const blockEntry = blocks[blockId]
      const value = blockEntry?.value
      if (!value) continue
      const { type, properties } = value
      if (type === 'tweet' && properties?.source) {
        const src = properties.source[0][0]
        // parse id from https://twitter.com/_ijjk/status/TWEET_ID format
        const tweetId = src.split('/')[5]?.split('?')[0]
        if (!tweetId) continue

        try {
          const res = await fetch(
            `https://api.twitter.com/1/statuses/oembed.json?id=${tweetId}`
          )
          const json = await res.json()
          // alguns renderers leem properties.html, mantemos compatibilidade:
          if (properties.html) {
            properties.html = json.html.split('<script')[0]
          } else {
            // se não existir, cria a chave html para o bloco
            properties.html = [ [ json.html.split('<script')[0] ] ]
          }
          post.hasTweet = true
        } catch (e) {
          console.log(`Failed to get tweet embed for ${src}`, e)
        }
      }
    }
  } catch (e) {
    console.warn('Erro ao processar tweets em recordMap', e)
  }

  const { users } = await getNotionUsers(post.Authors || [])
  post.Authors = Object.keys(users).map((id) => users[id].full_name)

  return {
    props: {
      post,
      preview: preview || false,
    },
    revalidate: 10,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const postsTable = await getBlogIndex()
  return {
    paths: Object.keys(postsTable)
      .filter((post) => postsTable[post].Published === 'Yes')
      .map((slug) => getBlogLink(slug)),
    fallback: true,
  }
}

const RenderPost = ({ post, redirect, preview }: any) => {
  const router = useRouter()

  useEffect(() => {
    const twitterSrc = 'https://platform.twitter.com/widgets.js'
    // make sure to initialize any new widgets loading on
    // client navigation
    if (post && post.hasTweet) {
      if ((window as any)?.twttr?.widgets) {
        ;(window as any).twttr.widgets.load()
      } else if (!document.querySelector(`script[src="${twitterSrc}"]`)) {
        const script = document.createElement('script')
        script.async = true
        script.src = twitterSrc
        document.querySelector('body')?.appendChild(script)
      }
    }
  }, [post])

  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect)
    }
  }, [redirect, post])

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!post) {
    return (
      <div className={blogStyles.post}>
        <p>
          Woops! didn't find that post, redirecting you back to the blog index
        </p>
      </div>
    )
  }

  return (
    <>
      <Header titlePre={post.Page} />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview?slug=${post.Slug}`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={blogStyles.post}>
        <h1>{post.Page || ''}</h1>
        {post.Authors && post.Authors.length > 0 && (
          <div className="authors">Por: {post.Authors.join(' ')}</div>
        )}
        {post.Date && <div className="posted">Publicado em {getDateStr(post.Date)}</div>}

        <hr />

        {!post.recordMap && <p>This post has no content</p>}

        {/* Renderização pelo renderer moderno */}
        {post.recordMap && (
          <NotionRenderer
            recordMap={post.recordMap}
            components={components}
            fullPage={false}
          />
        )}
      </div>
    </>
  )
}

export default RenderPost
