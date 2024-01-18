import addArticle from "@/lib/articles/addArticle";
import fetchNewsArticles from "@/lib/articles/fetchArticles";
import deleteArticle from "@/lib/articles/deleteArticle";

//Run pnpm run dev before testing!!!!

interface article {
    id: number;
    title: string;
    content: string;
    url: string;
}

test("Grab an random article", async () => {
    const articles: article[] = await fetchNewsArticles();
    const randomNumber = Math.floor(Math.random() * (articles.length - 0) + 0);
    expect(articles[randomNumber]).toBeDefined();
});

test("Add an article", async () => {
    const title: string = "title11";
    const content: string = "content11";
    const url: string = "https://url11";

    await addArticle(title, content, url);
    const articles: article[] = await fetchNewsArticles();
    const addedArticle = articles.at(-1);
    expect(addedArticle).toBeDefined();
    await deleteArticle(addedArticle?.id);
});


test("Delete an article", async () => {
    const title: string = "title11";
    const content: string = "content11";
    const url: string = "https://url11";

    await addArticle(title, content, url);
    const articles: article[] = await fetchNewsArticles();
    const addedArticle = articles.at(-1);
    expect(addedArticle).toBeDefined();
    await deleteArticle(addedArticle?.id);

    const refreshedArticles: article[] = await fetchNewsArticles();
    const deletedArticle = refreshedArticles.find(article => article.id === addedArticle?.id);
    expect(deletedArticle).toBeUndefined();
});













