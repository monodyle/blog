import { getCollection } from 'astro:content'

export async function getBlogCollection() {
  const content = (await getCollection('blog'))
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
