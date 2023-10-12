import styles from "./page.module.css";
import Container from "../components/Container";
import clsx from "clsx";

interface Event {
  name: string;
  date: Date;
}

type Calendar = { [key: string]: Event[] };

const calendar: Calendar = {
  januari: [],
  februari: [],
  maart: [],
  april: [],
  mei: [],
  juni: [],
  juli: [],
  augustus: [],
  september: [],
  oktober: [],
  november: [],
  december: [],
};

const monthFromDate = Intl.DateTimeFormat("nl", { month: "long" }).format;

const events: Event[] = Array.from({ length: 40 }, Math.random)
  .map((x) => ({
    name: Math.round(Math.random()) ? "Meeting" : "Cursus",
    date: new Date(new Date().getTime() + x * (365 * 24 * 60 * 60 * 1000)),
  }))
  .toSorted((a, b) => a.date.getTime() - b.date.getTime());

for (const date of events) {
  const month = monthFromDate(date.date);
  calendar[month].push(date);
}

const createEventEl = (event: Event) => (
  <div key={event.date.getMilliseconds()} className={styles.event}>
    <div className={styles.info}>
      <div className={styles.eventDay}>{event.date.getDate()}</div>
      <div className={styles.eventName}>{event.name}</div>
    </div>
    <div className={styles.signUp}>Inschrijven</div>
  </div>
);

const Page = () => {
  const eventElements = Object.entries(calendar)
    .filter(([_, events]) => events.length)
    .map(([month, events]) => (
      <div key={month} className={clsx(styles.month, styles[month])}>
        <h2 className={styles.monthName}>{month}</h2>
        <div className={styles.eventsWrapper}>
          <div className={clsx(styles.bar, styles[month])}></div>
          <div className={styles.events}>{events.map(createEventEl)}</div>
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
