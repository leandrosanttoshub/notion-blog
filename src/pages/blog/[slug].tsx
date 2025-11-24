import { useRouter } from 'next/router'
import Link from 'next/link'
import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'

import getBlogIndex from '../../lib/notion/getBlogIndex'
import getPage from '../../lib/notion/getPage'
import Header from '../../components/header'
import blogStyles from '../../styles/blog.module.css'
import { getBlogLink, getDateStr } from '../../lib/blog-helpers'

// componentes extras do react-notion-x (code, equations, collections etc.)
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  { ssr: false }
)
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  { ssr: false }
)

export async function getStaticProps({ params: { slug } }) {
  const postsTable = await getBlogIndex()
  const post = postsTable[slug]

  if (!post) {
    return {
      props: {
        redirect: '/blog'
      }
    }
  }

  const recordMap = await getPage(post.id)

  return {
    props: {
      post,
      recordMap
    },
    revalidate: 10
  }
}

export async function getStaticPaths() {
  const postsTable = await getBlogIndex()

  return {
    paths: Object.keys(postsTable)
      .filter((slug) => postsTable[slug].Published === 'Yes')
      .map((slug) => getBlogLink(slug)),
    fallback: true
  }
}

export default function BlogPost({ post, recordMap, redirect }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div className={blogStyles.post}>Carregando...</div>
  }

  if (redirect) {
    router.replace(redirect)
    return null
  }

  return (
    <>
      <Header titlePre={post.Page} />

      <div className={blogStyles.post}>
        <h1>{post.Page}</h1>

        {post.Date && (
          <div className="posted">Publicado em {getDateStr(post.Date)}</div>
        )}

        <hr />

        <NotionRenderer
          recordMap={recordMap}
          fullPage={false}
          darkMode={false}
          components={{
            Code,
            Equation,
            Collection,
            Pdf,
            Modal
          }}
        />
      </div>
    </>
  )
}
