import styles from "./page.module.css";
import Container from "../components/Container";
import Link from "next/link";
import clsx from "clsx";

const Page = () => {
  const actions = [
    { text: "Accounts Beheren", href: "/admin/accountbeheer", symbol: "person_search" },
    { text: "Agenda Aanpassen", href: "/admin/agendabeheer", symbol: "edit_calendar" },
    { text: "Forum Moderatie", href: "", symbol: "shield" },
    { text: "Bug Meldingen", href: "/admin/bugmeldingenbeheer", symbol: "bug_report" },
    { text: "Educatie Modules", href: "/admin/educatiemodules", symbol: "book_4" },
    { text: "Casussen Beheren", href: "/admin/casussenbeheer", symbol: "cases" },
    { text: "Nieuws artikelen", href: "", symbol: "newspaper" }
  ]
  return (
    <Container title="Admin">
      <nav>
        <ul className={styles.actions}>
          {actions.map(({ text, href, symbol }, i) =>
            <li key={i}>
              <Link className={styles.button} href={href}>
                <i className={clsx(styles.symbol, "symbol")}>{symbol}</i>
                <span className={styles.buttonText}>{text}</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </Container>
  );
};

export default Page;
