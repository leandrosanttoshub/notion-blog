import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/header'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import {
  getBlogLink,
  getDateStr,
  postIsPublished,
} from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'

// Definindo os tipos de posts

const TYPE_LABELS: Record<string, string> = {
  Problemas1: 'Problemas que você acha que tem',
  Problemas2: 'Problemas que eu acho que talvez você tenha',
  Devocionais: 'Devocionais',
  Estudos: 'Estudos',
}

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map((slug) => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      return post
    })
    .filter(Boolean)

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map((post) => {
    post.Authors = post.Authors.map((id) => users[id].full_name)
  })

  return {
    props: {
      preview: preview || false,
      posts,
    },
    revalidate: 10,
  }
}

const Index = ({ posts = [], preview }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const menuWrapStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    marginTop: -10,
    marginBottom: 15,
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  }

  const btnStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid rgba(0,0,0,0.15)',
    padding: '3px 8px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontFamily: 'inherit',
    color: '#333',
    transition: 'background .2s ease',
  }

  const btnActiveStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#000',
    color: '#fff',
    borderColor: '#000',
  }

  return (
    <>
      <Header titlePre="Blog" />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b> Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>My Notion Blog</h1>

        {/* Submenu de categorias */}
        {/* Submenu de categorias (3 linhas), com estilo inline para garantir override */}
        <div className={blogStyles.categoryMenu} style={menuWrapStyle}>
          {/* Linha 1 */}
          <button
            className={`${blogStyles.categoryButton} ${
              selectedType === 'Problemas1' ? blogStyles.activeCategory : ''
            }`}
            style={selectedType === 'Problemas1' ? btnActiveStyle : btnStyle}
            onClick={() => setSelectedType('Problemas1')}
          >
            Problemas que você acha que tem
          </button>

          {/* Linha 2 */}
          <button
            className={`${blogStyles.categoryButton} ${
              selectedType === 'Problemas2' ? blogStyles.activeCategory : ''
            }`}
            style={selectedType === 'Problemas2' ? btnActiveStyle : btnStyle}
            onClick={() => setSelectedType('Problemas2')}
          >
            Problemas que eu acho que talvez você tenha
          </button>

          {/* Linha 3 */}
          <div className={blogStyles.categoryRow} style={rowStyle}>
            {['Devocionais', 'Estudos'].map((type) => (
              <button
                key={type}
                className={`${blogStyles.categoryButton} ${
                  selectedType === type ? blogStyles.activeCategory : ''
                }`}
                style={selectedType === type ? btnActiveStyle : btnStyle}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}

            <button
              className={blogStyles.categoryButton}
              style={selectedType === null ? btnActiveStyle : btnStyle}
              onClick={() => setSelectedType(null)}
            >
              Todos
            </button>
          </div>
        </div>

        {posts.length === 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}

        {posts
          .filter((post) => !selectedType || post.Type === selectedType)
          .map((post) => {
            return (
              <div className={blogStyles.postPreview} key={post.Slug}>
                <h3>
                  <span className={blogStyles.titleContainer}>
                    {!post.Published && (
                      <span className={blogStyles.draftBadge}>Draft</span>
                    )}
                    <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                      <a>{post.Page}</a>
                    </Link>
                  </span>
                </h3>
                {post.Authors.length > 0 && (
                  <div className="authors">Por: {post.Authors.join(' ')}</div>
                )}
                {post.Date && (
                  <div className="posted">
                    Publicado em {getDateStr(post.Date)}
                  </div>
                )}
                <p>
                  {(!post.preview || post.preview.length === 0) &&
                    'No preview available'}
                  {(post.preview || []).map((block, idx) =>
                    textBlock(block, true, `${post.Slug}${idx}`)
                  )}
                </p>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default Index
