import React from 'react';
import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { PostLink } from '../components/PostLink';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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
  total_pages: number;
  total_results_size: number;
  page: number;
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
    total_pages: postsPagination.total_pages,
    page: postsPagination.page,
    total_results_size: postsPagination.total_results_size,
  } as ResultProps);

  const handleLoadMore = async () => {
    let dados = [...newPosts];

    await fetch(result.next_page)
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
            first_publication_date: post.first_publication_date,
          } as Post;
        });

        posts.forEach(p => {
          dados.push(p);
        });

        setNewPosts(dados);
      });
  };

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
        {result.next_page ? (
          <a
            href="#"
            onClick={handleLoadMore}
            className={`${styles.loadMore} ${
              result.next_page ? '' : styles.invisible
            }`}
          >
            Carregar mais posts
          </a>
        ) : (
          ''
        )}
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
      /* first_publication_date: format(
        new Date(post.first_publication_date),
        'd MMM yyyy',
        { locale: ptBR }
      ), */
      first_publication_date: post.first_publication_date,
    } as Post;
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        page: postsResponse.page,
        total_results_size: postsResponse.total_results_size,
        total_pages: postsResponse.total_pages,
        results: posts,
      },
    },
  };
};
