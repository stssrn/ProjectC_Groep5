"use client";

import styles from "./page.module.css";
import Container from "@/app/components/Container";
import { useEffect, useState } from "react";
import type { users } from "@prisma/client";
import EditUserDialog from "./EditUserDialog";
import NewUserDialog from "./NewUserDialog";
import type { SearchType } from "@/app/api/user/route";

const Page = () => {
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [allUsers, setAllUsers] = useState<users[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<users[]>([]);
  const [currentUser, setCurrentUsers] = useState<users>();
  const [orderBy, setOrderBy] = useState<"id" | "firstName" | "lastName" | "registationDate">("id");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [searchFor, setSearchString] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("name")
  const [pressedSearch, setPressedSearch] = useState(false);

  const fetchUsers = async (): Promise<users[] | undefined> => {
    try {
      const response = await fetch(`/api/user`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const sortAndFilterUsers = (users: users[]) => {
    let sortedUsers = [...users];
    const multiplier = orderDirection === "asc" ? 1 : -1;
    sortedUsers.sort((a, b) => {
      switch (orderBy) {
        case "id":
          return multiplier * (a.id - b.id);
        case "firstName":
          return multiplier * a.firstName.localeCompare(b.firstName);
        case "lastName":
          return multiplier * a.lastName.localeCompare(b.lastName);
        case "registationDate":
          return multiplier * (new Date(a.registationDate).getTime() - new Date(b.registationDate).getTime());
        default:
          return 0;
      }
    });

    return sortedUsers.filter(user => {
      if (searchType === "id") {
        return user.id.toString().includes(searchFor);
      } else {
        const fullName = user.firstName + " " + user.lastName;
        return fullName.toLowerCase().includes(searchFor.toLowerCase());
      }
    });
  }

  useEffect(() => {
    (async () => {
      const users = await fetchUsers();
      if (users) {
        setAllUsers(users);
        setFilteredUsers(sortAndFilterUsers(users));
      } else {
        console.error("Failed to fetch accounts :(");
      }
      setPressedSearch(false);
    })();
  }, [orderBy, orderDirection, pressedSearch]);

  useEffect(() => {
    if (allUsers) {
      setFilteredUsers(sortAndFilterUsers(allUsers));
    }
  }, [orderBy, orderDirection, allUsers]);

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
          type={searchType === "id" ? "number" : "text"}
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
      <div>
        <div className={styles.sort}>
          Sorteer op:{" "}
          <select
            className={styles.sortSelect}
            value={orderBy}
            onChange={e => setOrderBy(e.target.value as "id" | "registationDate" | "firstName" | "lastName")}
          >
            <option value="id">ID</option>
            <option value="firstName">Voornaam</option>
            <option value="lastName">Achternaam</option>
            <option value="registationDate">Registratiedatum</option>
          </select>
          <select
            className={styles.sortSelect}
            value={orderDirection}
            onChange={e => setOrderDirection(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Oplopend</option>
            <option value="desc">Aflopend</option>
          </select>
        </div>
      </div>
      {filteredUsers ? (
        <table className={styles.table}>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Voornaam</th>
              <th>Achternaam</th>
              <th>Registratiedatum</th>
              <th></th>
            </tr>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className={styles.tableId}>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{new Date(user.registationDate).toLocaleDateString()}</td>
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
      ) : <div>Gebruikersgegevens aan het ophalen...</div>}
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
