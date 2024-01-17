import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import ReportedPost from "./ReportedPost";
import { userFromDb } from "@/models/user";

type Post = React.ComponentProps<typeof ReportedPost>["post"];
type Reports = React.ComponentProps<typeof ReportedPost>["reports"];

const Page = async () => {
  const dbReports = await prisma.reportedPost.findMany({
    include: {
      post: {
        include: {
          user: true,
        },
      },
      user: true,
    },
  });

  const postIdPostMap: { [k: Post["id"]]: Post } = Object.fromEntries(
    dbReports.map((x) => [
      x.post.id,
      { ...x.post, user: userFromDb(x.post.user) },
    ])
  );

  const reportMap: { [k: Post["id"]]: Reports } = Object.fromEntries(
    dbReports.map((x) => [x.postId, []])
  );

  for (const report of dbReports) {
    reportMap[report.postId].push({
      reportedBy: userFromDb(report.user),
      reason: report.reason,
      date: report.date,
    });
  }

  const reportEntries = Object.entries(reportMap);

  return (
    <div>
      <h1 className={styles.title}>Forum Moderatie</h1>
      <div className={styles.posts}>
        {reportEntries.length ? (
          reportEntries.map(([postId, reports]) => {
            const post = postIdPostMap[Number(postId)];
            return (
              <ReportedPost
                key={postId}
                post={{
                  id: post.id,
                  content: post.content,
                  user: {
                    username: post.user.username,
                    profilePhotoURL: post.user.profilePhotoURL,
                    firstName: post.user.firstName,
                    lastName: post.user.lastName,
                  },
                }}
                reports={reports}
              ></ReportedPost>
            );
          })
        ) : (
          <p>Er zijn geen posts gerapporteerd.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
