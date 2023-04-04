import styles from "../styles/NotFound.module.css";
import NotFoundPageImage from "../assets/404_page_not_found.svg";
import { Link } from "react-router-dom";
const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <img className={styles.image} src={NotFoundPageImage} alt="" />
      <Link to="/" className={styles.link}>
        Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
