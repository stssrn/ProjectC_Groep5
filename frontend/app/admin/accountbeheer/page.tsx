"use client";

import getRandomAccounts, { Account } from "@/lib/accounts";
import styles from "./page.module.css";
import Container from "@/app/components/Container";
import { useEffect, useId, useState } from "react";

const Page = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account>();

  const dialogFirstName = useId();
  const dialogLastName = useId();

  useEffect(() => {
    setAccounts(getRandomAccounts(20));
  }, []);

  return (
    <Container title="Accounts Beheren">
      <div className={styles.filterOptions}>
        <select className={styles.select} name="" id="">
          <option value="">Naam</option>
          <option value="">ID</option>
        </select>
        <input
          className={styles.search}
          type="search"
          name=""
          id=""
          placeholder="Bevat…"
        />
        <input className={styles.button} type="button" value="Zoek" />
      </div>
      <div className={styles.sort}>
        Sorteer op:{" "}
        <select className={styles.sortSelect}>
          <option>ID</option>
          <option>Voornaam</option>
          <option>Achternaam</option>
          <option>Registratiedatum</option>
        </select>
      </div>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Voornaam</th>
            <th>Achternaam</th>
            <th>Registratiedatum</th>
            <th></th>
          </tr>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className={styles.tableId}>{account.id}</td>
              <td>{account.firstName}</td>
              <td>{account.lastName}</td>
              <td>{account.creationDate.toISOString()}</td>
              <td>
                <button
                  className={styles.edit}
                  onClick={() => {
                    setCurrentAccount(account);
                    setShowDialog(true);
                  }}
                >
                  <i className="symbol">edit</i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className={styles.dialogBackdrop}
        style={{ display: showDialog ? "block" : "none" }}
      >
        <div className={styles.dialog}>
          <label htmlFor={dialogFirstName}>Voornaam</label>
          <input
            type="text"
            name="Voornaam"
            disabled
            value={currentAccount?.firstName}
            id={dialogFirstName}
            className={styles.textBox}
          />
          <label htmlFor={dialogLastName}>Achternaam</label>
          <input
            type="text"
            name="Achternaam"
            id={dialogLastName}
            disabled
            value={currentAccount?.lastName}
            className={styles.textBox}
          />
          <input type="button" value="Opslaan" className={styles.button} />
          <input
            type="button"
            value="Sluiten"
            className={styles.secondaryButton}
            onClick={() => setShowDialog(false)}
          />
        </div>
      </div>
    </Container>
  );
};

export default Page;
