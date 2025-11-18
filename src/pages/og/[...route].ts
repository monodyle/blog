import type { APIRoute } from "astro";
import {
  getBlogCollection,
  getNotesCollection,
  getTilCollection,
} from "src/lib/content";
import { buildImage } from "../../lib/og";

const mapper =
  (collection: "blog" | "notes" | "til") =>
  (entry: { slug: string | undefined }) => ({
    params: { route: [collection, entry.slug].join("/") },
    props: { entry },
  });

export async function getStaticPaths() {
  const [blog, notes, til] = await Promise.all([
    getBlogCollection(),
    getNotesCollection(),
    getTilCollection(),
  ]);

  const paths = [
    ...blog.map(mapper('blog')),
    ...notes.map(mapper('notes')),
    ...til.map(mapper('til')),
  ];

  return paths;
}

const init: ResponseInit = {
  headers: {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=31536000, immutable",
  },
};

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props;
  const title = entry?.data?.title;

  if (!title) {
    return new Response(new Uint8Array([255, 255, 255, 255]), init);
  }

  try {
    const imageData = await buildImage({
      title,
      type: entry.collection,
    });

    if (!imageData) {
      return new Response(new Uint8Array([255, 255, 255, 255]), init);
    }

    return new Response(imageData as BodyInit, init);
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating image", { status: 500 });
  }
};
