import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss';

interface PostProps {
  post: {
    uid?: string;
    first_publication_date: string | null;
    data: {
      title: string;
      subtitle: string;
      author: string;
    };
  };
}
export function PostLink({post}: PostProps) {
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
