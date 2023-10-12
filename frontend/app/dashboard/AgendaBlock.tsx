import styles from "./AgendaBlock.module.css";
import Container from "../components/Container";
import agendaData from "@/lib/agenda";
import { clsx } from "clsx";

const today = new Date();
const upcommingEvent = Object.entries(agendaData)
  .flatMap(([month, events]) => events.map((e) => ({ month, ...e })))
  .at(0);

const AgendaBlock: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <section className={className}>
      <Container title="Agenda">
        <h2>{upcommingEvent?.month}</h2>
        <div className={styles.wrapper}>
          <div
            className={clsx(
              styles.bar,
              upcommingEvent && styles[upcommingEvent.month]
            )}
          ></div>
          <div className={styles.info}>
            <p className={styles.day}>{upcommingEvent?.date.getDate()}</p>
            <p className={styles.name}>{upcommingEvent?.name}</p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AgendaBlock;
