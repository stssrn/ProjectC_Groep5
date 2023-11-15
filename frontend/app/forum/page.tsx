import getRandomAccounts from "@/lib/accounts";
import Container from "../components/Container";
import styles from "./page.module.css";
import Post from "./Post";

const posts = getRandomAccounts(10).map(({ firstName, lastName}) => ({
  name: `${firstName} ${lastName}`,
  username: `${firstName}${lastName}`,
  content: "hello world",
  likes: (Math.random() * 20) | 0,
  commentCount: (Math.random() * 20) | 0,
  date: new Date(),
}))

const Page = () => {
  return (
    <Container title="Forum">
      <div className={styles.column}>
        {posts.map(({name, username, content, commentCount, likes, date}, i) => (
        <Post
          key={i}
          fullName={name}
          username={username}
          content={content}
          commentCount={commentCount}
          likes={likes}
          date={date}
        />
        ))}
      </div>
    </Container>
  );
};

export default Page;
