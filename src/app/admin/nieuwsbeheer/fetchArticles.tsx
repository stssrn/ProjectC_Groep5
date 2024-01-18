const fetchNewsArticles = async () => {
    try {
        const response = await fetch(`/api/newsArticles?id=${0}`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch newsArticles data");
        }

        const data = await response.json();
        return data.newsArticles;

    } catch (error) {
        console.error("Error fetching newsArticles data:", error);

    }
};

export default fetchNewsArticles;