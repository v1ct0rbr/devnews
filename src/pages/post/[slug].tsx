import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import readingTime from 'reading-time';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface ReadingProps {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

interface Content {
  /* heading: string;
  body: { text: string }; */
  heading: string;
  body: String[];
}

interface PostType {
  uid: string;
  first_publication_date: string | null;
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
  post: PostType;
}

export default function Post({ post }: PostProps) {
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

  /* const calcTotalTime = (post: PostType): number => {
    const totalTime = post.data.content.reduce((currTime, currentContent) => {
      const body = RichText.asText(currentContent.body);
      const statsHeading = readingTime(currentContent.heading);
      const statsBody = readingTime(body);
      return currTime + statsHeading.time + statsBody.time;
    }, 0);

    return Math.round(totalTime / 1000 / 60);
  }; */

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

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});
  // console.log(response.data.content[0].body);

  /* const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,

    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },

      content: response.data.content.map(content => {
        return {
          // heading: content.heading,
          // ,
          heading: content.heading,
          body: content.body,
        } as Content;
      }),
    },
  } as PostType; */
  const post = { ...response };

  // console.log(post.data.content[0].body[0]);

  return {
    props: {
      post,
    },
  };

  //  const response = await prismic.getByUID(TODO);

  // TODO
};
