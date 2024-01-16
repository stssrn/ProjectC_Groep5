import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Image from "next/image";
import { userFromDb } from "@/models/user";
import PostList from "./PostList";

const Page = async ({ params }: { params: { username: string } }) => {
  // const session = useSession();
  //const userId = session.data?.user.id;
  const username = decodeURIComponent(params.username).slice(1);
  const dbUser = await prisma.users.findFirst({
    where: {
      username,
    },
  });
  const user = userFromDb(dbUser!);

  return (
    <main>
      {user && dbUser && (
        <>
          <div className={styles.infoSection}>
            <div className={styles.sectionTop}>
              <div className={styles.profilePicture}>
                <Image
                  src={user.profilePhotoURL}
                  alt=""
                  width={100}
                  height={100}
                  className={styles.profilePictureImage}
                />
              </div>
              <div className={styles.textInfo}>
                <h1
                  className={styles.fullName}
                >{`${user.firstName} ${user.lastName}`}</h1>
                <div className={styles.username}>@{username}</div>
              </div>
            </div>
            <div className={styles.sectionBottom}>
              {dbUser.bio ?? "Geen bio"}
            </div>
          </div>
          <PostList username={user.username} />
        </>
      )}
    </main>
  );
};

export default Page;
