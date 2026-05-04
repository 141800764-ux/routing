"use client"

import Link from "next/link"
import styles from "./navbar.module.css"
import Theme from "./theme" // adjust path if needed

const Navbar = () => {
  return (
    <header>
      <nav className={styles.nav}>
        <p>Next.js</p>

        <ul className={styles.links}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        {/* ✅ THIS is your theme button */}
        <Theme />
      </nav>
    </header>
  )
}

export default Navbar