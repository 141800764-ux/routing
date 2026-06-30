import Link from "next/link"
import styles from "./projects.module.css"

export const dynamic = "force-dynamic";

export default function ProjectPage() {
  return (
    <main>
      <h1>Project Lists</h1>

      <ul className={styles.ul}>
        <li>
          <Link href="/projects/jobit">Jobit</Link>
        </li>
        <li>
          <Link href="/projects/carrent">Carrent</Link>
        </li>
        <li>
          <Link href="/projects/hipnode">Hipnode</Link>
        </li>
      </ul>
    </main>
  )
}