import styles from "./page.module.css";
import Container from "../components/Container";
import Event from "./Event";
import clsx from "clsx";

import agendaData from "@/lib/agenda";
import { monthNames } from "@/lib/agenda";

// the month a new year starts, and works in case there are no events in
// January. Assumes there are no events planned more than a year in advance.
const newYearMonth = Object.entries(agendaData)
  .filter(([_, events]) => events.length)
  .map(([month, _]) => month)
  .find((m, i) => monthNames.indexOf(m) <= i);

const Page = () => {
  const eventElements = Object.entries(agendaData)
    .filter(([_, events]) => events.length)
    .map(([month, events]) => (
      <div key={month} className={clsx(styles.month, styles[month])}>
        {month === newYearMonth && <h1>2024</h1>}
        <h2 className={styles.monthName}>{month}</h2>
        <div className={styles.eventsWrapper}>
          <div className={clsx(styles.bar, styles[month])}></div>
          <div className={styles.events}>
            {events.map((e) => (
              <Event key={e.date.getDate()} event={e} />
            ))}
          </div>
        </div>
      </div>
    ));

  return (
    <Container title="Agenda">
      <div className={styles.months}>{eventElements}</div>
    </Container>
  );
};

export default Page; //
