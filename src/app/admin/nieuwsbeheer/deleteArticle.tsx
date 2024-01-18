const deleteArticle = async (articleID: any) => {
    try {
        const response = await fetch(`/api/newsArticles?id=${articleID}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete newsArticles data");
        }
    } catch (error) {
        console.error("Error deleting newsArticles data:", error);
    }
};

export default deleteArticle;