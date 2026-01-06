import { getCollection } from 'astro:content'

export async function getBlogCollection() {
  const content = (await getCollection('blog'))
    .filter((entry) => entry.data.public !== false)
    .sort(
      (a, b) =>
        new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
    )
    .map((entry) => ({
      ...entry,
      slug: entry.filePath?.split('/').pop()?.split('.')[0],
      date: new Date(entry.data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }))

  return content
}

export async function getTilCollection() {
  const content = (await getCollection('til'))
    .filter((entry) => entry.data.public !== false)
    .map((entry) => ({
      ...entry,
      slug: entry.filePath?.split('/').pop()?.split('.')[0],
    }))
    .sort(
      (a, b) =>
        new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
    )

  return content
}

export async function getNotesCollection() {
  const content = (await getCollection('notes'))
    .filter((entry) => entry.data.public !== false)
    .map((entry) => ({
      ...entry,
      slug: entry.filePath?.split('/').pop()?.split('.')[0],
    }))
    .sort(
      (a, b) =>
        new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
    )
  return content
}

export async function getAllCollections() {
  const collections = await Promise.all([
    getBlogCollection(),
    getTilCollection(),
    getNotesCollection(),
  ])

  return collections.flat().sort((a, b) => {
    return new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
  })
}

export type Post = Awaited<ReturnType<typeof getAllCollections>>[number]
