"use client";
import styles from "./page.module.css";
import Container from "@/app/components/Container";
import { useState, useEffect, useId } from "react";

interface EducatieModule {
    id?: number;
    title?: string;
    description?: string;
}

const Page = () => {
    const [currentModule, setCurrentModule] = useState<EducatieModule | undefined>();
    const [educatieModules, setEducatieModules] = useState<EducatieModule[]>([]);
    const [educatieModulesUnfiltered, setEducatieModulesUnfiltered] = useState<EducatieModule[]>([]);
    const [sortCriteria, setSortCriteria] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [titleIsEmpty, setTitleIsEmpty] = useState(false);
    const [descIsEmpty, setDescIsEmpty] = useState(false);
    const [showCreateModule, setShowCreateModule] = useState(false);
    const [newModule, setNewModule] = useState<EducatieModule>({ id: 0, title: '', description: '' });
    const [showMessage, setShowMessage] = useState(false);
    const [usingSort, setUsingSort] = useState(false);


    const dialogTitle = useId();
    const dialogDescription = useId();
    const [showDialog, setShowDialog] = useState(false);

    const saveEditedData = async (title: string, desc: string) => {
        try {
            const response = await fetch(`/api/educatie`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: Number(currentModule?.id),
                    title,
                    description: desc,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update educatie_modules data");
            }
        } catch (error) {
            console.error("Error updating educatie_modules data:", error);
        }
    };

    const deleteEducatieModuleHandler = async (moduleID: any) => {
        await deleteEducatieModule(moduleID);
        setShowDialog(false);
        setDescIsEmpty(false);
        setTitleIsEmpty(false);
        refreshEducatieModules();
    };

    const deleteEducatieModule = async (moduleID: any) => {
        try {
            const response = await fetch(`/api/bug?id=${moduleID}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete educatie_modules data");
            }
        } catch (error) {
            console.error("Error deleting educatie_modules data:", error);
        }
    };

    const fetchEducatieModules = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/educatie?id=${0}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch educatie_modules data");
            }

            const data = await response.json();
            return data.educatieModules;
        } catch (error) {
            console.error("Error fetching educatie_modules data:", error);
        }
    };

    const sortData = () => {
        const sortedData = [...educatieModules];
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

        setEducatieModules(sortedData);
        setUsingSort(false);
    };

    const sortArray = () => {
        const sortedModules = [...educatieModules];
        sortedModules.sort((a, b) => {
            if (sortOrder === 'asc') {
                return (a?.id || 0) - (b?.id || 0);
            } else {
                return (b?.id || 0) - (a?.id || 0);
            }
        });

        setEducatieModules(sortedModules);
        setUsingSort(false);
    };

    const filterData = () => {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
        if (searchInput) {
            const query = searchInput.value;
            const filteredData = educatieModulesUnfiltered.filter((module) =>
                module.id?.toString().includes(query.toLowerCase()) ||
                module.title?.toLowerCase().includes(query.toLowerCase()) ||
                module.description?.toLowerCase().includes(query.toLowerCase())
            );

            setEducatieModules(filteredData);
        }
    };

    const addModule = async (moduleID: number, title: string, desc: string) => {
        try {
            const response = await fetch(`/api/educatie?id=${moduleID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: Number(moduleID),
                    title,
                    description: desc,
                }),
            });
            setShowCreateModule(false);
            if (!response.ok) {
                throw new Error("Failed to delete educatie_modules data");
            }
        } catch (error) {
            console.error("Error deleting educatie_modules data:", error);
        }
    }

    const addModuleHandler = async (id: number, title: any, description: any) => {
        await addModule(id, title, description);
        newModule.id = 0;
        newModule.title = "";
        newModule.description = "";
        refreshEducatieModules();
    }

    const saveAndClose = async () => {
        if (!currentModule) return;

        await saveEditedData(currentModule.title || '', currentModule.description || '');
        setShowDialog(false);
        refreshEducatieModules();
    };

    const refreshEducatieModules = async () => {
        const modules = await fetchEducatieModules();
        if (modules) {
            setEducatieModules(modules);
            setEducatieModulesUnfiltered(modules);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const modules = await fetchEducatieModules();
            if (modules) {
                setEducatieModules(modules);
                setEducatieModulesUnfiltered(modules);
            }

            if (window.innerWidth < 650) {
                setShowMessage(true);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (educatieModules.length > 0 && usingSort) {
            if (sortCriteria === 'id') sortArray();
            else sortData();
        }
    }, [educatieModules, sortCriteria, sortOrder]);



    if (isLoading) {
        return <div>Laden...</div>;
    }

    if (showMessage) {
        return <h1>Deze pagina is alleen toegangelijk op een groter beeldscherm</h1>
    }

    return (
        <Container title="Educatie modules beheer">
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
                    onClick={() => setShowCreateModule(true)}
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
                        <th>Beschrijving</th>
                        <th></th>
                    </tr>
                    {educatieModules.map((module) =>
                        <tr key={module.id}>
                            <td className={styles.tableId}>{module.id}</td>
                            <td>{module.title}</td>
                            <td>{module.description}</td>
                            <td>
                                <button
                                    className={styles.edit}
                                    onClick={() => {
                                        setCurrentModule(module);
                                        setShowDialog(true);
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
                        value={currentModule?.title || ""}
                        id={dialogTitle}
                        className={titleIsEmpty === false ? styles.textBox : styles.errorBorder}
                        onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                    />
                    <label htmlFor={dialogDescription}>Beschrijving</label>
                    <textarea
                        name="Beschrijving"
                        id={dialogDescription}
                        value={currentModule?.description || ""}
                        rows={25}
                        cols={75} // Set the number of rows you want to display initially
                        className={descIsEmpty === false ? styles.textBox : styles.errorBorder}
                        onChange={(e) => setCurrentModule({ ...currentModule, description: e.target.value })}
                    />

                    <input
                        type="button"
                        value="Opslaan"
                        className={styles.button}
                        onClick={() => {
                            if (currentModule?.title) setTitleIsEmpty(false);
                            else setTitleIsEmpty(true);
                            if (currentModule?.description) {
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
                            deleteEducatieModuleHandler(currentModule?.id)
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
            {showCreateModule && (
                <div className={styles.createModule}>
                    <div className={styles.newDialog}>
                        <label htmlFor={dialogDescription}>Titel</label>
                        <input
                            type="text"
                            name="Titel"
                            value={newModule?.title || ""}
                            id={dialogTitle}
                            className={`${styles.textBox} ${titleIsEmpty ? styles.errorBorder : ''}`}
                            onChange={(e) => {
                                setNewModule({ ...newModule, title: e.target.value });
                                setTitleIsEmpty(e.target.value.trim() === '');
                            }}
                        />
                        <label htmlFor={dialogDescription}>Beschrijving</label>
                        <textarea
                            name="Beschrijving"
                            id={dialogDescription}
                            value={currentModule?.description || ""}
                            rows={25}
                            cols={75} // Set the number of rows you want to display initially
                            className={descIsEmpty === false ? styles.textBox : styles.errorBorder}
                            onChange={(e) => setCurrentModule({ ...currentModule, description: e.target.value })}
                        />
                        <div className={styles.newDialogButtons}>
                            <div
                                onClick={() => setShowCreateModule(false)}
                                className={styles.newSecondaryButton}
                            >
                                Sluiten
                            </div>
                            <div
                                className={styles.newButton}
                                onClick={() => {
                                    if (newModule?.title) setTitleIsEmpty(false);
                                    else setTitleIsEmpty(true);
                                    if (newModule?.description) {
                                        setDescIsEmpty(false);
                                        newModule.id = educatieModules.length + 1;
                                        addModuleHandler(Number(newModule?.id), newModule?.title, newModule?.description);
                                    } else setDescIsEmpty(true);
                                }}
                            >
                                Maak module
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container >
    );
};

export default Page;