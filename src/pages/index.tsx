import React, { createElement, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { ReactElement, useRef, useState } from 'react';
import { PostLink } from '../components/PostLink';
import Post from './post/[slug]';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

interface ResultProps {
  page: number;
  results_per_page: number;
  results_size: number;
  total_results_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
  results: Array<Post>;
  version?: string;
  licence?: string;
}

export default function Home({ postsPagination }: HomeProps) {
  const [newPosts, setNewPosts] = useState<Array<Post>>([]);
  const [result, setResult] = useState({
    next_page: postsPagination.next_page,
  } as ResultProps);

  const handleLoadMore = async () => {
    let dados = [...newPosts];

    await fetch(postsPagination.next_page)
      .then(response => response.json())
      .then(data => {
        setResult(data);

        const posts = data.results.map(post => {
          return {
            uid: post.uid,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
            first_publication_date: format(
              new Date(post.first_publication_date),
              'd MMM yyyy',
              { locale: ptBR }
            ),
          } as Post;
        });

        posts.forEach(p => {
          dados.push(p);
        });

        setNewPosts(dados);
      });
  };

  function createLinkElement(post: Post) {
    return React.createElement('link', { children: getPostLink(post) });
  }

  /*   const createLinkElement = (post: Post) => {
    let elem = createElement('link', {
      className: styles.postCard,
      children: {
        type: 'link',{props:teste(post)},
      },
    });
    return elem;
  }; */

  function getPostLink(post: Post): ReactElement {
    return (
      <Link href={`/post/${post.uid}`} key={post.uid}>
        <a className={styles.postCard}>
          <h2 className={styles.postTitle}>{post.data.title}</h2>
          <h3 className={styles.postSubtitle}>{post.data.subtitle}</h3>
          <div className={styles.info}>
            <time className={styles.postInfo}>
              <FiCalendar />
              {post.first_publication_date}
            </time>
            <span className={styles.postInfo}>
              <FiUser />
              {post.data.author}
            </span>
          </div>
        </a>
      </Link>
    );
  }

  return (
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <main className={commonStyles.contentContainer}>
        <div className={styles.postList}>
          {postsPagination.results.map(post => (
            <PostLink key={post.uid} post={post} />
          ))}
          {newPosts.map(post => (
            <PostLink key={post.uid} post={post} />
          ))}
        </div>

        <a
          href="#"
          onClick={handleLoadMore}
          className={`${styles.loadMore} ${
            result.next_page ? '' : styles.invisible
          }`}
        >
          Carregar mais posts
        </a>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 1,
    }
  );

  // console.log(postsResponse.results);

  const posts = await postsResponse.results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
      first_publication_date: format(
        new Date(post.first_publication_date),
        'd MMM yyyy',
        { locale: ptBR }
      ),
    } as Post;
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
  };
};
