import styles from "./page.module.css";
import Container from "../components/Container";
import Event from "./Event";
import clsx from "clsx";

import agendaData from "@/lib/agenda";

const Page = () => {
  const eventElements = Object.entries(agendaData)
    .filter(([_, events]) => events.length)
    .map(([month, events]) => (
      <div key={month} className={clsx(styles.month, styles[month])}>
        <h2 className={styles.monthName}>{month}</h2>
        <div className={styles.eventsWrapper}>
          <div className={clsx(styles.bar, styles[month])}></div>
          <div className={styles.events}>{events.map(e => <Event key={e.date.getDate()} event={e}/>)}</div>
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
