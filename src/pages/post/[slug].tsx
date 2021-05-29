import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
  return (
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <main>
        <header className={styles.banner}>
          <img className={styles.imgBanner} src="/Banner.png" />
        </header>
        <article className={styles.article}>
          <div className={commonStyles.contentContainer}>
            <h1>Criando um app CRA do zero</h1>
            <div className={styles.info}>
              <span className={styles.infoItem}>
                <FiCalendar /> 15 Mar 2021
              </span>
              <span className={styles.infoItem}>
                <FiUser /> Joseph Oliveira
              </span>
              <span className={styles.infoItem}>
                <FiClock /> 4min
              </span>
            </div>

            <p className={styles.content}>
              <p>
                Existem várias alternativas de banco de dados baseados em
                modelos específicos de estruturas de dados como hierárquico,
                relacional, orientado a objetos, documental, entre outros.{' '}
              </p>

              <h2>SQL</h2>

              <p>
                O SQL, baseado no modelo relacional, é caraterizado por sua
                estrutura em tabelas. Cada tabela contém campos ou colunas.
                Essas colunas podem apresentar critérios de tipos (String,
                número, boleano, data, etc.), unicidade, tamanho, nulidade ou
                até referenciar dados em outras Entidades/Tabelas. As tabelas,
                por sua vez contém registros ou linhas.
              </p>

              <img
                loading="lazy"
                src="https://devbench.com.br/wp-content/uploads/2021/01/sql_tabela.png"
                alt="tabela - sql"
                className="wp-image-2712"
                sizes="(max-width: 566px) 100vw, 566px"
                title="SQL VS noSQL 1"
                width="566"
                height="390"
              />

              <p>
                Existem basicamente três tipos de relações entre as tabelas:
              </p>

              <p>*One-to-one(Um para um)</p>

              <p>*One-to-many(Um para muitos)</p>

              <p>*Many-to-may(Muitos para muitos)</p>

              <p>
                O SQL significa “linguagem de consulta estruturada”, portanto
                utilizamos consultas ou queries para interagir com o banco de
                dados. Por exemplo:
              </p>

              <p>
                <strong>select </strong>* <strong>from</strong> cliente{' '}
                <strong>where</strong>
              </p>

              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                (tipo = ‘J’ and cidade &lt;&gt; 14) <strong>or</strong>
              </p>

              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                (tipo = ‘F’ and cidade = 14)
              </p>

              <p>
                <strong>order by</strong> nome
              </p>

              <p>
                A consulta acima exibi todos os dados dos clientes que são do
                tipo pessoa jurídica e que não sejam da cidade de código igual a
                14, o que são do tipo pessoa física e da cidade de código igual
                a 14, ordenando pelo nome em ordem ascendente.
              </p>

              <p>
                Percebemos que a consulta contém algumas palavras chaves como
                “select”, “from” e “Where”. Além disso temos os dados e
                parâmetros os quais utilizamos para definir a filtragem das
                informações obtidas através da query.
              </p>

              <h2>
                <strong>noSQL</strong>
              </h2>

              <p>
                O modelo noSQL baseado em documentos, vem ganhando muito espaço
                embora o relacional ainda seja amplamente utilizado. Ao
                contrário desse, o noSQL, não tem esquemas nem relações.
                Baseia-se, portanto em coleções (um conceito parecido com
                tabela, mas não as veja como tal) em que, ao em vez de
                registros, encontramos os chamados documentos. Estes, por sua
                vez, não apresentam um esquema bem definido, pois os
                objetos/documentos podem assumir diferentes formas. Em outras
                palavras, você pode armazenar documentos que geralmente são
                iguais, mas podem conter alguns campos diferentes. Outra
                característica marcante é a falta de relação entre as coleções.
                Os dados simplesmente são duplicados e inseridos na coleção
                específica se a referência for necessária. Por um lado, devemos
                nos preocupar com a atualização em cada coleção, por outro não
                nos preocupamos com consultas de código longo que podem acabar
                afetando o desempenho.
              </p>

              <img
                loading="lazy"
                src="https://devbench.com.br/wp-content/uploads/2021/01/nosql_documents.png"
                alt="nosql_documents"
                className="wp-image-2713"
                sizes="(max-width: 566px) 100vw, 566px"
                title="SQL VS noSQL 2"
                width="566"
                height="272"
              />

              <p>
                No exemplo acima, percebemos que, na leitura da coleção Orders,
                é provável que possamos obter todos os dados necessários sem ter
                que procurar em outras coleções tornando essa uma das grandes
                vantagens do NoSQL.
              </p>

              <p>Resumidamente temos as seguintes características:</p>

              <ul>
                <li>Ausência de um esquema definido para as coleções;</li>
                <li>
                  Não há relação de dados (Podemos criar relações entre
                  documentos, porém não precisamos. E não se deve fazer em
                  demasia, pois as consultas se tornam lentas).
                </li>
              </ul>

              <p>
                Existe uma grande diferença entre bancos de dados SQL e noSQL em
                relação a escalabilidade.
              </p>

              <p>
                Assim, à medida que nosso aplicativo cresce e precisamos
                armazenar mais, mais dados são adicionados e acessados com mais
                frequência, talvez seja necessário dimensionar/escalonar nossos
                servidores de banco de dados de forma horizontal e vertical
              </p>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <strong>Escalonamento Horizontal</strong>
                    </td>
                    <td>
                      <strong>Escalonamento Vertical</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Adição de novos servidores e interconexão de forma
                      inteligente. Esse processo é mais complicado de ser
                      realizado e não há limites para o crescimento.
                    </td>
                    <td>
                      Significa o fortalecimento o nosso servidor existente
                      adicionando mais CPU ou memória. Geralmente é uma tarefa
                      bem mais fácil, porém não se pode realiza-lo de forma
                      indefinida.
                    </td>
                  </tr>
                </tbody>
              </table>

              <p>
                O escalonamento horizontal para o modelo SQL É muito difícil /
                praticamente impossível, porém o escalonamento vertical é um
                solução simples. Portanto, tempos o seguinte problema: Se
                tivermos várias ou milhares de queries de leitura/gravação por
                segundo, talvez nosso banco de dados, através de consultas
                longas (com junções complexas) entre tabelas relacionadas, possa
                atingir seu limite operacional.
              </p>

              <p>
                No NoSQL, que não apresenta estruturas específicas/esquemas,
                possui poucas relações e os dados normalmente não são
                distribuídos através de múltiplas coleções, o dimensionamento
                horizontal é mais fácil (Ainda é uma operação complexa), mas
                alguns provedores de nuvem fazem essa operação por nós. Portanto
                obtemos um ótimo desempenho para solicitações de leitura e
                gravação em massa.
              </p>
            </p>
          </div>
        </article>

        <a href="#" className={styles.loadMore}>
          Carregar mais posts
        </a>
      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
