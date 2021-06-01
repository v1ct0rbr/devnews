import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import next, { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';
import Comments from '../../components/Comments';
import { useState } from 'react';
import Link from 'next/link';

interface Content {
  /* heading: string;
  body: { text: string }; */
  heading: string;
  body: String[];
}

interface postLink {
  uid: string;
  data: {
    title: string;
    subtitle: string;
  };
}

interface PostType {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: Content[];
  };
}

interface PostProps {
  preview: boolean;
  post: PostType;
  previousPost: postLink;
  nextPost: postLink;
}

const initialPostLink = { uid: '', data: { title: '', subtitle: '' } };

export default function Post({
  preview,
  post,
  previousPost,
  nextPost,
}: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const calcTotalTime = (content): number => {
    const words = content.reduce((acc: [], item) => {
      const asText = RichText.asText(item.body);
      const textSplit = asText.split(' ').filter(text => text);

      return [...acc, ...textSplit];
    }, []);

    const estimatedTime = Math.ceil(words.length / 200);

    return estimatedTime;
  };

 

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <main>
        <header className={styles.banner}>
          <img className={styles.imgBanner} src={post.data.banner.url} />
        </header>
        <article className={styles.article}>
          <div className={commonStyles.contentContainer}>
            <h1>{post.data.title}</h1>
            <div className={styles.info}>
              <time className={styles.infoItem}>
                <FiCalendar />
                {format(new Date(post.first_publication_date), 'd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
              <span className={styles.infoItem}>
                <FiUser /> {post.data.author}
              </span>
              <span className={styles.infoItem}>
                <FiClock />
                <span>{`${calcTotalTime(post.data.content)} min`}</span>
              </span>
            </div>
            <div className={styles.edition_date}>
              {post.first_publication_date !== post.last_publication_date
                ? format(
                    new Date(post.last_publication_date),
                    "'* editado em' dd MMM yyyy', às' H':'mm",
                    { locale: ptBR }
                  )
                : ''}
            </div>

            <div className={styles.content}>
              {post.data.content.map(({ heading, body }) => (
                <div key={heading}>
                  <h2>{heading}</h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: RichText.asHtml(body) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </article>
        <div className={styles.postLinks}>
          {previousPost?.uid ? (
            <div className={styles.link}>
              <Link href={`${previousPost?.uid}`}>
                <a>
                  <h3 className={styles.title}>{previousPost.data.title}</h3>

                  <span className={styles.obs}>Post Anterior</span>
                </a>
              </Link>
            </div>
          ) : (
            <div></div>
          )}

          {nextPost?.uid ? (
            <div className={`${styles.link} ${styles.right}`}>
              <Link href={`${nextPost?.uid}`}>
                <a>
                  <h3 className={styles.title}>{nextPost.data.title}</h3>
                  <span className={styles.obs}>Próximo Post</span>
                </a>
              </Link>
            </div>
          ) : (
            ''
          )}
        </div>
        <Comments
          label={post.data.title}
          repo="v1ct0rbr/devnews"
          issueTitle={post.uid}
          theme="photon-dark"
        />
        {preview && (
          <aside>
            <Link href="/api/exit-preview">
              <a className={commonStyles.buttonPreview}>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['title', 'subtitle', 'author'],
      pageSize: 1,
    }
  );

  return {
    paths: postsResponse.results.map(post => ({
      params: {
        slug: post.uid,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref || null,
  });

  const responsePreviousPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );
  const previousPost = responsePreviousPost.results;

  const responseNextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]' /** ordenação */,
    }
  );
  const nextPost = responseNextPost.results;

  /*  const last_publication_date =
    response.first_publication_date !== response.last_publication_date
      ? format(
          new Date(response.last_publication_date),
          "'* editado em' dd MMM yyyy', às' H':'mm",
          { locale: ptBR }
        )
      : ''; */

  return {
    props: {
      preview,
      post: { ...response } ?? null,
      previousPost: previousPost.length > 0 ? previousPost[0] : initialPostLink,
      nextPost: nextPost.length > 0 ? nextPost[0] : initialPostLink,
    },
  };
};
