import styles from "./ForumSection.module.css";
import Container from "../components/Container";
import prisma from "@/lib/prisma";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { userFromDb } from "@/models/user";

const ForumBlock: React.FC<{
  className?: string;
}> = async ({ className }) => {
  const dbPosts = await prisma.post.findMany({
    take: 3,
    orderBy: {
      date: "desc",
    },
    include: {
      user: true,
      _count: {
        select: {
          ReactionPost: true,
        },
      },
    },
  });
  return (
    <section className={className}>
      <Container padding={12} title="Recente discussies">
        <div className={styles.posts}>
          {dbPosts.map((post, i) => {
            const user = userFromDb(post.user);
            return (
              <article key={i} className={styles.post}>
                <div className={styles.top}>
                  <div className={styles.topOverlay}></div>
                  <div className={styles.postImage}>
                    <Image
                      src={user.profilePhotoURL}
                      alt=""
                      height={200}
                      width={200}
                      className={styles.postImageImage}
                    />
                  </div>
                  <h2 className={styles.postTitle}>
                    <Link
                      href={`/forum/post/${post.id}`}
                      className={styles.postLink}
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className={styles.postTopic}>{post.content}</p>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.bottomSection}>
                    <i className={clsx("symbol", styles.symbol)}>person</i>
                    <Link
                      href={`/forum/@${user.username}`}
                      className={styles.authorLink}
                    >
                      {`${post.user.firstName} ${post.user.lastName}`}
                    </Link>
                  </div>
                  <div className={styles.bottomSection}>
                    <Link
                      href={`/forum/post/${post.id}`}
                      className={styles.postLink}
                    >
                      <i className={clsx("symbol", styles.symbol)}>message</i>
                      {post._count.ReactionPost}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
export default ForumBlock;
