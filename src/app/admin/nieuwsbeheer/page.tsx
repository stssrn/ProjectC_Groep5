"use client";
import styles from "../educatiemodules/page.module.css";
import Container from "@/app/components/Container";
import { useState, useEffect, useId } from "react";
import addArticle from "../../../lib/articles/addArticle";
import fetchNewsArticles from "../../../lib/articles/fetchArticles";
import deleteArticle from "../../../lib/articles/deleteArticle";


interface newsArticle {
    id?: number,
    title?: string,
    content?: string,
    url?: string
}

const Page = () => {

    const [currentArticle, setCurrentArticle] = useState<newsArticle>();
    const [articlesUnfiltered, setArticlesUnfiltered] = useState<newsArticle[]>([]);
    const [articlesFiltered, setArticlesFiltered] = useState<newsArticle[]>([]);
    const [sortCriteria, setSortCriteria] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [titleIsEmpty, setTitleIsEmpty] = useState(false);
    const [contentIsEmpty, setContentIsEmpty] = useState(false);
    const [urlIsEmpty, setUrlIsEmpty] = useState(false);
    const [showCreateArticle, setShowCreateArticle] = useState(false);
    const [newArticle, setNewArticle] = useState<newsArticle>({ id: 0, title: '', content: '', url: '' });
    const [usingSort, setUsingSort] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const dialogTitle = useId();
    const dialogContent = useId();
    const dialogUrl = useId();




    const saveEditedArticle = async (title: any, content: any, url: any) => {
        try {
            const response = await fetch(`/api/newsArticles`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: Number(currentArticle?.id),
                    title: title,
                    content: content,
                    url: url
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update newsArticles data");
            }
        } catch (error) {
            console.error("Error updating newsArticles data:", error);
        }
    };





    const sortData = () => {
        const sortedData = [...articlesFiltered];
        sortedData.sort((a, b) => {
            const valueA = (a as any)[sortCriteria.toLowerCase()];
            const valueB = (b as any)[sortCriteria.toLowerCase()];

            if (sortOrder === 'asc') {
                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
            } else {
                if (valueA > valueB) return -1;
                if (valueA < valueB) return 1;
            }

            return 0;
        });
        setArticlesFiltered(sortedData);
        setUsingSort(false);
    };

    const filterData = () => {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
        if (searchInput) {
            const query = searchInput.value;
            const filteredData = articlesUnfiltered.filter((article) =>
                article.id?.toString().includes(query.toLowerCase()) ||
                article.title?.toLowerCase().includes(query.toLowerCase()) ||
                article.content?.toLowerCase().includes(query.toLowerCase()) ||
                article.url?.toLowerCase().includes(query.toLowerCase())
            );

            setArticlesFiltered(filteredData);
        }
    };


    function isValidUrl(str: string) {
        try {
            new URL(str);
            return true;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const articles = await fetchNewsArticles();
            if (articles) {
                setArticlesUnfiltered(articles);
                setArticlesFiltered(articles);
            }
            setIsLoading(false);
            setRefresh(false);
        };
        fetchData();
    }, [refresh]);

    useEffect(() => {
        if (articlesFiltered.length > 0 && usingSort) {
            sortData();
        }
    }, [articlesFiltered, sortCriteria, sortOrder]);

    if (isLoading) {
        return <div>Laden...</div>;
    }

    return (
        <Container title="Nieuws Beheer">
            <div className={styles.filterOptions}>
                <input
                    className={styles.search}
                    type="search"
                    name=""
                    id="searchInput"
                    placeholder="Bevat…"
                    defaultValue={searchQuery}
                />
                <input
                    className={styles.button}
                    type="button"
                    value="Zoek"
                    onClick={filterData}
                />
                <button
                    className={styles.add}
                    onClick={() => setShowCreateArticle(true)}
                >
                    <i className="symbol">add</i>
                </button>
            </div>
            <div className={styles.sort}>
                Sorteer op:{" "}
                <select
                    className={styles.sortSelect}
                    value={sortCriteria}
                    onChange={(e) => {
                        setUsingSort(true);
                        setSortCriteria(e.target.value);
                    }}
                >
                    <option value="ID">ID</option>
                    <option value="title">Titel</option>
                </select>
                <select
                    className={styles.sortSelect}
                    value={sortOrder}
                    onChange={(e) => {
                        setUsingSort(true);
                        setSortOrder(e.target.value as 'asc' | 'desc');
                    }}
                >
                    <option value="asc">Oplopend</option>
                    <option value="desc">Aflopend</option>
                </select>
            </div>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Titel</th>
                        <th>Content</th>
                        <th>URL</th>
                        <th></th>
                    </tr>
                    {articlesFiltered.map((article) =>
                        <tr key={article.id}>
                            <td className={styles.tableId}>{article.id}</td>
                            <td>{article.title}</td>
                            <td>{article.content}</td>
                            <td>{article.url}</td>
                            <td>
                                <button
                                    className={styles.edit}
                                    onClick={() => {
                                        setCurrentArticle(article);
                                        setShowEdit(true);
                                    }}
                                >
                                    <i className="symbol">edit</i>
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showEdit && (
                <div className={styles.dialogBackdrop}>
                    <div className={styles.dialog}>
                        <div className={styles.content}>
                            <label htmlFor={dialogTitle}>Titel</label>
                            <input
                                type="text"
                                name="Titel"
                                value={currentArticle?.title || ""}
                                id={dialogTitle}
                                className={titleIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                            />
                            <label htmlFor={dialogUrl}>URL</label>
                            <input
                                type="text"
                                name="url"
                                value={currentArticle?.url || ""}
                                id={dialogUrl}
                                className={urlIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => setCurrentArticle({ ...currentArticle, url: e.target.value })}
                            />
                            <label htmlFor={dialogContent}>Content</label>
                            <textarea
                                name="Content"
                                id={dialogContent}
                                value={currentArticle?.content || ""}
                                rows={15}
                                cols={75}
                                className={contentIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                            />
                        </div>
                        <div className={styles.adminDialogButtons}>
                            <input
                                type="button"
                                value="Opslaan"
                                className={styles.button}
                                onClick={() => {
                                    if (currentArticle?.title) setTitleIsEmpty(false);
                                    else setTitleIsEmpty(true);
                                    if (currentArticle?.content) setContentIsEmpty(false);
                                    else setContentIsEmpty(true);
                                    if (currentArticle?.url) {
                                        setUrlIsEmpty(false);
                                        if (isValidUrl(currentArticle?.url)) {
                                            setUrlIsEmpty(false);
                                            saveEditedArticle(currentArticle?.title, currentArticle?.content, currentArticle?.url);
                                            setRefresh(true);
                                            setShowEdit(false);
                                        }
                                        else setUrlIsEmpty(true);
                                    } else setUrlIsEmpty(true)
                                }}
                            />
                            <input
                                type="button"
                                value="Verwijderen"
                                className={styles.button}
                                onClick={() => {
                                    deleteArticle(currentArticle?.id);
                                    setShowEdit(false);
                                    setRefresh(true);
                                }}
                            />

                            <input
                                type="button"
                                value="Sluiten"
                                className={styles.secondaryButton}
                                onClick={() => {
                                    setShowEdit(false);
                                    setContentIsEmpty(false);
                                    setTitleIsEmpty(false);
                                    setUrlIsEmpty(false)
                                }} />

                        </div>
                    </div>
                </div>
            )}
            {showCreateArticle && (
                <div className={styles.createModuleBackdrop}>
                    <div className={styles.createModule}>
                        <div className={styles.newDialog}>
                            <label htmlFor={dialogTitle}>Titel</label>
                            <input
                                type="text"
                                name="Titel"
                                value={newArticle?.title || ""}
                                id={dialogTitle}
                                className={`${styles.textBox} ${titleIsEmpty ? styles.errorBorder : ''}`}
                                onChange={(e) => {
                                    setNewArticle({ ...newArticle, title: e.target.value });
                                    setTitleIsEmpty(e.target.value.trim() === '');
                                }}
                            />
                            <label htmlFor={dialogUrl}>URL</label>
                            <input
                                type="text"
                                name="URL"
                                value={newArticle?.url || ""}
                                id={dialogTitle}
                                className={`${styles.textBox} ${urlIsEmpty ? styles.errorBorder : ''}`}
                                onChange={(e) => {
                                    if (!isValidUrl(e.target.value)) setUrlIsEmpty(true);
                                    else setUrlIsEmpty(false);
                                    setNewArticle({ ...newArticle, url: e.target.value });
                                    setUrlIsEmpty(e.target.value.trim() === '');
                                }}
                            />
                            <label htmlFor={dialogContent}>Content</label>
                            <textarea
                                name="Content"
                                id={dialogContent}
                                value={newArticle?.content || ""}
                                rows={25}
                                cols={75}
                                className={contentIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                            />

                            <div className={styles.newDialogButtons}>
                                <div
                                    onClick={() => setShowCreateArticle(false)}
                                    className={styles.newSecondaryButton}
                                >
                                    Sluiten
                                </div>
                                <div
                                    className={styles.newButton}
                                    onClick={() => {
                                        if (newArticle?.title) setTitleIsEmpty(false);
                                        else setTitleIsEmpty(true);
                                        if (newArticle?.content) setContentIsEmpty(false);
                                        else setContentIsEmpty(true);
                                        if (newArticle?.url) {
                                            setUrlIsEmpty(false);
                                            if (isValidUrl(newArticle?.url)) {
                                                setUrlIsEmpty(false);
                                                addArticle(newArticle?.title, newArticle?.content, newArticle?.url);
                                                setNewArticle({ id: 0, title: '', content: '', url: '' })
                                                setRefresh(true);
                                                setShowCreateArticle(false);
                                            }
                                            else setUrlIsEmpty(true);

                                        } else setUrlIsEmpty(true);
                                    }}
                                >
                                    Maak artikel
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
}

export default Page;