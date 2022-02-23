import styles from "../styles/layout.module.scss";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <a
          href="https://project-holi.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by the HOLI team
        </a>
      </footer>
    </>
  );
}
