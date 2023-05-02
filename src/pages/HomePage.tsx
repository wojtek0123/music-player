import styles from "../styles/Home.module.css";
import { Player } from "../components/Player";

const HomePage = () => {
  return <div className={styles.container}>{<Player />}</div>;
};

export default HomePage;
