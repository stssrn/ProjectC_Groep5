import prisma from "@/lib/prisma";
import { userFromDb } from "@/models/user";
import ForumSectionWidget from "./ForumSectionWidget";

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

  type Posts = React.ComponentProps<typeof ForumSectionWidget>["posts"];
  const posts: Posts = dbPosts.map((p) => {
    const user = userFromDb(p.user);
    return {
      id: p.id,
      thumbnailUrl: user.profilePhotoURL,
      title: p.title,
      content: p.content,
      userFullname: `${user.firstName} ${user.lastName}`,
      username: user.username,
      commentCount: p._count.ReactionPost,
    };
  });
  return <ForumSectionWidget className={className} posts={posts} />;
};
export default ForumBlock;
