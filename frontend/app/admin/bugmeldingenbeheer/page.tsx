"use client";
import styles from "./page.module.css";
import Container from "@/app/components/Container";
import { useState, useEffect, useId } from "react";

interface BugReport {
    id?: number;
    date?: Date;
    title?: string;
    description?: string;
}

interface BugReportWithUserId {
    id: number;
    userId: number,
    title: string;
    description: string;
    date: Date;
}

interface BugUser {
    id: number,
    bugId: number,
    userId: number,
}

const Page = () => {
    const [currentReport, setCurrentReport] = useState<BugReport | undefined>();

    const [bugReportsWithUserId, setBugReportsWithUserId] = useState<BugReportWithUserId[]>([]);
    const [bugReportsWithUserIdUnfiltered, setBugReportsWithUserIdUnfiltered] = useState<BugReportWithUserId[]>([]);
    const [sortCriteria, setSortCriteria] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentUserId, setCurrentUserId] = useState(0);
    const [titleIsEmpty, setTitleIsEmpty] = useState(false);
    const [descIsEmpty, setDescIsEmpty] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [pressedSearch, setPressedSearch] = useState(false);



    const dialogTitle = useId();
    const dialogDescription = useId();
    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const saveEditedData = async (title: any, desc: any) => {
        try {
            const response = await fetch(`/api/bug`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: Number(currentReport?.id),
                    title: title,
                    description: desc,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to update bug report data");
            }
        } catch (error) {
            console.error("Error updating bug report data:", error);
        }
    };

    const deleteBugReportHandler = async (bugID: any, userID: any) => {
        await deleteBugUserEntry(bugID, userID);
        await deleteBugReportEntry(bugID);
        setShowDialog(false);
        setDescIsEmpty(false);
        setTitleIsEmpty(false);
        await refreshBugReports();
    };

    const deleteBugReportEntry = async (bugID: any) => {
        try {
            const response = await fetch(`/api/bug?id=${bugID}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete bug report data");
            }
        } catch (error) {
            console.error("Error deleting bug report data:", error);
        }
    };

    const deleteBugUserEntry = async (bugID: any, userID: any) => {
        try {
            const response = await fetch(`/api/bugUser`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bugId: bugID,
                    userId: userID,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to delete bug and/or user report data");
            }
        } catch (error) {
            console.error("Error updating bug and/or user report data:", error);
        }
    };

    const fetchBugReports = async () => {
        try {
            //console.log("going in")
            setIsLoading(true);
            const response = await fetch(`/api/bug?id=${0}`, {
                method: "GET",
            });
            //console.log(response);
            if (!response.ok) throw new Error("Failed to fetch bug report data");
            const data = await response.json();
            if (data.formattedBugs) {
                //console.log("finished bugreportsfetch")
                //console.log(data);
                return data.formattedBugs;
                //console.log(bugReports);
                //console.log(data.formattedBugs);

            } else {
                console.error("Unexpected response format:", data);
            }

        } catch (error) {
            console.error("Error fetching bug report data:", error);
        }
    };

    const fetchBugUserData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/bugUser?id=${0}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch bug report data");
            const data = await response.json();
            //console.log("finished buguserfetch")
            //console.log(data);
            return data.BugReportData;

        } catch (error) {
            console.error("Error fetching bug report data:", error);
        }
    };
    const combineBugReportsAndBugUserData = async (bugReports: any, bugUserData: any) => {

        const combinedData: BugReportWithUserId[] = [];

        for (const report of bugReports) {
            const userEntry = bugUserData.find((user: BugUser) => user.bugId === report.id);

            if (userEntry) {
                const combinedEntry: BugReportWithUserId = {
                    id: report.id,
                    userId: userEntry.userId,
                    title: report.title,
                    description: report.description,
                    date: report.date,
                };

                combinedData.push(combinedEntry);
            }
        }

        setBugReportsWithUserId(combinedData);
        setBugReportsWithUserIdUnfiltered(combinedData);
        if (window.innerWidth < 650) {
            setShowMessage(true);
        }
        setIsLoading(false);
    };
    const sortData = () => {
        const sortedData = [...bugReportsWithUserId];
        sortedData.sort((a, b) => {
            const valueA = (a as any)[sortCriteria];
            const valueB = (b as any)[sortCriteria];

            if (sortOrder === 'asc') {
                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
            } else {
                if (valueA > valueB) return -1;
                if (valueA < valueB) return 1;
            }

            return 0;
        });
        delay(5000);
        setBugReportsWithUserId(sortedData);
    };

    const filterDataByTitle = () => {
        console.log("in the filter data")
        const filteredData = bugReportsWithUserId.filter((report) =>
            report.id.toString().includes(searchQuery.toLowerCase()) ||
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.userId.toString().includes(searchQuery.toLowerCase()) ||
            new Date(report.date).toISOString().includes(searchQuery.toLowerCase())
        );

        setBugReportsWithUserId(filteredData);
    };

    const saveAndClose = async () => {
        if (!currentReport) return;

        await saveEditedData(currentReport.title, currentReport.description);
        setShowDialog(false);
        refreshBugReports();
    };

    const refreshBugReports = async () => {
        const reports = await fetchBugReports();
        const bugUser = await fetchBugUserData();
        combineBugReportsAndBugUserData(reports, bugUser);
    };

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        const fetchData = async () => {
            const reports = await fetchBugReports();
            const bugUser = await fetchBugUserData();
            //console.log("buguser:" + bugUser)

            combineBugReportsAndBugUserData(reports, bugUser);

        };

        fetchData();
    }, []);

    useEffect(() => {
        if (bugReportsWithUserId.length > 0) {
            sortData();
        }
    }, [bugReportsWithUserId, sortCriteria, sortOrder]);

    useEffect(() => {
        // Check if the search query is empty, and reset data if true
        if (!searchQuery) {
            setBugReportsWithUserId(bugReportsWithUserIdUnfiltered);
            delay(3000);
            return;
        }
        if (pressedSearch) {
            filterDataByTitle();
            setPressedSearch(false);
        }

    }, [searchQuery, bugReportsWithUserIdUnfiltered]);

    if (isLoading) {
        return <div>Laden...</div>;
    }

    if (showMessage) {
        return <h1>Deze pagina is alleen toegangelijk op een groter beeldscherm</h1>
    }
    return (
        <Container title="Bug meldingen beheer">
            <div className={styles.filterOptions}>
                <input
                    className={styles.search}
                    type="search"
                    name=""
                    id=""
                    placeholder="Bevat…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <input
                    className={styles.button}
                    type="button"
                    value="Zoek"
                    onClick={() => {
                        console.log("clicked")
                        setPressedSearch(true);
                        console.log(pressedSearch);
                        filterDataByTitle;
                    }

                    }
                />
            </div>
            <div className={styles.sort}>
                Sorteer op:{" "}
                <select
                    className={styles.sortSelect}
                    value={sortCriteria}
                    onChange={(e) => setSortCriteria(e.target.value)}
                >
                    <option value="id">ID</option>
                    <option value="title">Titel</option>
                    <option value="userId">UserID</option>
                    <option value="date">Datumnotatie</option>
                </select>
                <select
                    className={styles.sortSelect}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
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
                        <th>Beschrijving</th>
                        <th>userID</th>
                        <th>Datumnotatie</th>
                        <th></th>
                    </tr>
                    {bugReportsWithUserId.map((report) =>
                        <tr key={report.id}>
                            <td className={styles.tableId}>{report.id}</td>
                            <td>{report.title}</td>
                            <td>{report.description}</td>
                            <td>{report.userId}</td>
                            <td>{new Date(report.date).toISOString()}</td>
                            <td>
                                <button
                                    className={styles.edit}
                                    onClick={() => {
                                        setCurrentReport(report);
                                        setCurrentUserId(report.userId);
                                        setShowDialog(true)
                                    }}
                                >
                                    <i className="symbol">edit</i>
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div
                className={styles.dialogBackdrop}
                style={{ display: showDialog ? "block" : "none" }}
            >
                <div className={styles.dialog}>
                    <label htmlFor={dialogTitle}>Titel</label>
                    <input
                        type="text"
                        name="Titel"
                        value={currentReport?.title || ""}
                        id={dialogTitle}
                        className={titleIsEmpty === false ? styles.textBox : styles.errorBorder}
                        onChange={(e) => setCurrentReport({ ...currentReport, title: e.target.value })}
                    />
                    <label htmlFor={dialogDescription}>Beschrijving</label>
                    <textarea
                        name="Beschrijving"
                        id={dialogDescription}
                        value={currentReport?.description || ""}
                        rows={5}
                        cols={50}
                        className={`${styles.textBox} ${descIsEmpty ? styles.errorBorder : ''}`}
                        onChange={(e) => setCurrentReport({ ...currentReport, description: e.target.value })}
                    />
                    <input
                        type="button"
                        value="Opslaan"
                        className={styles.button}
                        onClick={() => {
                            if (currentReport?.title) setTitleIsEmpty(false);
                            else setTitleIsEmpty(true);
                            if (currentReport?.description) {
                                setDescIsEmpty(false);
                                saveAndClose();
                            }
                            else setDescIsEmpty(true);

                        }}
                    />

                    <input
                        type="button"
                        value="Verwijderen"
                        className={styles.button}
                        onClick={() => {
                            deleteBugReportHandler(currentReport?.id, currentUserId)
                        }}
                    />
                    <input
                        type="button"
                        value="Sluiten"
                        className={styles.secondaryButton}
                        onClick={() => {
                            setShowDialog(false);
                            setDescIsEmpty(false);
                            setTitleIsEmpty(false);
                        }} />
                </div>
            </div>
        </Container >
    );
};

export default Page;

