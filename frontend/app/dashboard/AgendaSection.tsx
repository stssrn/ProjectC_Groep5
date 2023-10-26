import styles from "./AgendaSection.module.css";
import Container from "../components/Container";
import agendaData from "@/lib/agenda";
import { clsx } from "clsx";

const today = new Date();
const upcomingEvents = Object.entries(agendaData)
  .flatMap(([month, events]) => events.map((e) => ({ month, ...e })))
  .filter((x) => x.date.getMonth() === today.getMonth())
  .slice(0, 2)

upcomingEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
const month = upcomingEvents.at(0)?.month;

const AgendaBlock: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <section className={className}>
      <Container padding={12} title="Agenda">
        {upcomingEvents.length ? (
          <>
            <h2 className={styles.month}>{month}</h2>
            <div className={styles.wrapper}>
              <div className={clsx(styles.bar, month && styles[month])}></div>
              <div className={styles.events}>
                {upcomingEvents.map(({ date, name }, i) => (
                  <div key={i} className={styles.info}>
                    <p className={styles.day}>{date.getDate()}</p>
                    <p className={styles.name}>{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className={styles.noEvents}>
            Er zijn geen agenda-items deze maand.
          </p>
        )}
      </Container>
    </section>
  );
};

export default AgendaBlock;
