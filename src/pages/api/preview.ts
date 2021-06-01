import { Document } from '@prismicio/client/types/documents';
import { getPrismicClient } from '../../services/prismic';
function linkResolver(doc: Document): string {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

// import { Client, linkResolver } from "../../prismic-configuration"

export default async (req, res) => {
  const prismic = getPrismicClient();
  const { token: ref, documentId } = req.query;
  const redirectUrl = await prismic
    .getPreviewResolver(ref, documentId)
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });

  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${redirectUrl}" />
    <script>window.location.href = '${redirectUrl}'</script>
    </head>`
  );
  res.end();
};
