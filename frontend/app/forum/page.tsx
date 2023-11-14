import getRandomAccounts from "@/lib/accounts";
import Container from "../components/Container";
import styles from "./page.module.css";
import Post from "./Post";

const Page = () => {
  const [poster] = getRandomAccounts(1);

  return (
    <Container title="Forum">
      <div className={styles.column}>
        <Post
          postedBy={`${poster.firstName} ${poster.lastName}`}
          content="hello world"
          likes={3}
          date={new Date()}
        />
      </div>
    </Container>
  );
};

export default Page;
