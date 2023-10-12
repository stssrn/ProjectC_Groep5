import styles from "./Event.module.css";
import { AgendaEvent } from "@/lib/agenda";

const EventComponent: React.FC<{ event: AgendaEvent }> = ({ event }) => (
  <div key={event.date.getMilliseconds()} className={styles.event}>
    <div className={styles.info}>
      <div className={styles.eventDay}>{event.date.getDate()}</div>
      <div className={styles.eventName}>{event.name}</div>
    </div>
    <div className={styles.signUp}>Inschrijven</div>
  </div>
);

export default EventComponent;
