import type { APIRoute } from 'astro'
import {
  getBlogCollection,
  getNotesCollection,
  getTilCollection,
} from 'src/lib/content'
import { buildImage } from '../../lib/og'

export async function getStaticPaths() {
  const [blog, notes, til] = await Promise.all([
    getBlogCollection(),
    getNotesCollection(),
    getTilCollection(),
  ])

  const paths = [
    ...blog.map((entry) => ({
      params: { route: `${['blog', entry.slug].join('/')}.png` },
      props: { entry },
    })),
    ...notes.map((entry) => ({
      params: { route: `${['notes', entry.slug].join('/')}.png` },
      props: { entry },
    })),
    ...til.map((entry) => ({
      params: { route: `${['til', entry.slug].join('/')}.png` },
      props: { entry },
    })),
  ]

  return paths
}

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props
  const title = entry?.data?.title

  if (!title) {
    return new Response(new Uint8Array([255, 255, 255, 255]), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  try {
    const imageData = await buildImage({
      title,
      type: entry.collection,
    })

    return new Response(imageData, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Error generating image', { status: 500 })
  }
}
