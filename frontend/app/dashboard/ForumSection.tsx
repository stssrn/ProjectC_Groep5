import styles from "./ForumSection.module.css";
import Container from "../components/Container";
import clsx from "clsx";

interface Post {
    title: string;
    topic: string;
    author: string;
    reactions: number;
}

const post: Post = {
    title: "Title",
    topic:
        "Topic",
    author: "Author Name",
    reactions: 10,
};

const posts: Post[] = new Array(3).fill(post);

const ForumBlock: React.FC<{
    className?: string;
}> = ({ className }) => {
    return (
        <section className={className}>
            <Container padding={12} title="Populaire discussies">
                <div className={styles.posts}>
                    {posts.map((post, i) => (
                        <article key={i} className={styles.post}>
                            <div className={styles.top}>
                                <div className={styles.topOverlay}></div>
                                <div className={styles.postImage}></div>
                                <h2 className={styles.postTitle}>{post.title}</h2>
                                <p className={styles.postTopic}>{post.topic}</p>
                            </div>
                            <div className={styles.bottom}>
                                <div className={styles.bottomSection}>
                                    <i className={clsx("symbol", styles.symbol)}>person</i>
                                    {post.author}
                                </div>
                                <div className={styles.bottomSection}>
                                    <i className={clsx("symbol", styles.symbol)}>message</i>
                                    {post.reactions}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
};
export default ForumBlock;
