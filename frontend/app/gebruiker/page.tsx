import Container from "../components/Container";
import styles from "./page.module.css";

const Page = () => {
  return (
    <Container title="Profiel">
      <div className={styles.parentContainer}>
        <img
          className={styles.circularProfilePhoto}
          src="https://randomuser.me/api/portraits/men/88.jpg"
          alt="Profile"
        />
        <div className={styles.userInfo}>
          <table>
            <thead>
              <tr>
                <th>Profielgegevens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Naam:</td>
              </tr>
              <tr>
                <td>Leeftijd:</td>
              </tr>
              <tr>
                <td>Email:</td>
              </tr>
              <tr>
                <td>Bio:</td>
              </tr>
              <tr>
                <td>Punten:</td>
              </tr>
            </tbody>
          </table>
          <button className={styles.saveButton}>Opslaan</button>
        </div>
      </div>
    </Container>
  );
};

export default Page;
