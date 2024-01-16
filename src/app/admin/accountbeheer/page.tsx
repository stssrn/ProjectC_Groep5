"use client";

import styles from "./page.module.css";
import Container from "@/app/components/Container";
import { useEffect, useState } from "react";
import type { users } from "@prisma/client";
import EditUserDialog from "./EditUserDialog";
import NewUserDialog from "./NewUserDialog";
import type { Ordering, SearchType } from "@/app/api/user/route";

const Page = () => {
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [allUsers, setAllUsers] = useState<users[]>();
  const [currentUser, setCurrentUsers] = useState<users>();
  const [orderBy, setOrderBy] = useState<Ordering>("id");
  const [searchFor, setSearchString] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("name")
  const [pressedSearch, setPressedSearch] = useState(false);

  const fetchUsers = async (
    orderBy: Ordering = "id",
    searchType?: SearchType,
    searchFor?: string
  ): Promise<users[] | undefined> => {
    try {
      let url = `/api/user?orderby=${orderBy}`;

      // checking for truthy value is fine in this case (i hope)
      if (searchType && searchFor) {
        url += `&searchFor=${searchFor}&searchType=${searchType}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch user data");

      return await response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const users = await fetchUsers(orderBy, searchType, searchFor);
      if (users) {
        setAllUsers(users);
      } else {
        console.error("Failed to fetch accounts :(");
      }
      setPressedSearch(false);
    })();
  }, [orderBy, pressedSearch]);

  return (
    <Container title="Accounts Beheren">
      <form className={styles.filterOptions}>
        <select
          className={styles.select}
          value={searchType}
          name="search-type"
          id="search-type"
          onChange={e => setSearchType(e.target.value as SearchType)}
        >
          <option value="name">Naam</option>
          <option value="id">ID</option>
        </select>
        <input
          className={styles.search}
          type="search"
          name="contains"
          id="contains"
          placeholder="Bevat…"
          value={searchFor}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <input
          className={styles.button}
          type="submit"
          value="Zoek"
          onClick={(e) => {
            e.preventDefault();
            setPressedSearch(true);
          }}
        />
      </form>
      <input
        className={styles.button}
        type="button"
        value="Nieuw account"
        onClick={() => {
          setShowNewUserDialog(true);
        }}
      />
      <div className={styles.sort}>
        Sorteer op:{" "}
        <select className={styles.sortSelect}
          onChange={p => setOrderBy(p.target.value as Ordering)}>
          <option value={"id"}>ID</option>
          <option value={"firstName"}>Voornaam</option>
          <option value={"lastName"}>Achternaam</option>
          <option value={"registationDate"}>Registratiedatum</option>
        </select>
      </div>
      {allUsers ? <table className={styles.table}>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Voornaam</th>
            <th>Achternaam</th>
            <th>Registratiedatum</th>
            <th></th>
          </tr>
          {allUsers.map((user) => (
            <tr key={user.id}>
              <td className={styles.tableId}>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.registationDate.toString()}</td>
              <td>
                <button
                  className={styles.edit}
                  onClick={() => {
                    setCurrentUsers(user);
                    setShowEditUserDialog(true);
                  }}
                >
                  <i className="symbol">edit</i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        : <div>Gebruikersgegevens aan het ophalen...</div>}
      <div
        className={styles.dialogBackdrop}
        style={{ display: showEditUserDialog ? "block" : "none" }}
      >
        {showEditUserDialog && (
          <EditUserDialog user={currentUser!} setShowDialog={setShowEditUserDialog} />
        )}
      </div>
      <div
        className={styles.dialogBackdrop}
        style={{ display: showNewUserDialog ? "block" : "none" }}
      >
        {showNewUserDialog && (
          <NewUserDialog setShowDialog={setShowNewUserDialog} />
        )}
      </div>
    </Container>
  );
};

export default Page;
