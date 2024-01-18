const addArticle = async (title: any, content: any, url: any) => {
    try {
        const response = await fetch(`/api/newsArticles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                content: content,
                url: url
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to add newsArticle data");
        }
    } catch (error) {
        console.error("Error adding newsArticle data:", error);
    }
};

export default addArticle;