"use client";

import "./globals.css";
import styles from "./layout.module.css";
import logo from "./logo.svg";
import clsx from "clsx";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const materialSymbols = localFont({
  variable: "--font-family-symbols", // Variable name (to reference after in CSS/styles)
  style: "normal",
  src: "../node_modules/material-symbols/material-symbols-rounded.woff2", // This is a reference to woff2 file from NPM package "material-symbols"
  display: "block",
  weight: "100 700",
});

const navItems = [
  { path: "gebruiker", symbol: "person", name: "Profiel" },
  { path: "dashboard", symbol: "dashboard", name: "Dashboard" },
  { path: "agenda", symbol: "calendar_month", name: "Agenda" },
  { path: "forum", symbol: "forum", name: "Forum" },
  { path: "quiz", symbol: "quiz", name: "Quiz" },
  { path: "winkel", symbol: "shopping_cart", name: "Winkel" },
  { path: "admin", symbol: "shield", name: "admin" },
  { path: "instellingen", symbol: "settings", name: "Instellingen" },
  { path: "faq", symbol: "help", name: "FAQ" },
  { path: "contact", symbol: "call", name: "Contact" },
  { path: "casussen", symbol: "book", name: "Casus" }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seg = useSelectedLayoutSegment();
  return (
    <html lang="en">
      <body className={clsx(inter.className, styles.body, materialSymbols.variable)}>
        <div className={styles.wrapper}>
<<<<<<< HEAD
                  {seg !== "quote" && seg !== "ggzinfo" &&
                      <header className={styles.header}>
                          <Image src={logo} alt="Antes Logo" height={24}></Image>
                          <div className={styles.cornerSquare}></div>
                      </header>
                  }
          <div className={styles.container}>{children}</div>
              </div>
              {seg !== "quote" && seg !== "ggzinfo" &&
                  <nav className={styles.nav}>
                      <ul className={styles.list}>
                          {seg !== "login" && navItems.map((p) => (
                              <li
                                  key={p.path}
                                  className={clsx(
                                      styles.listItem,
                                      p.path === seg && styles.active
                                  )}
                              >
                                  <Link href={`/${p.path}`} title={p.path}>
                                      <i className="symbol">{p.symbol}</i>
                                  </Link>
                              </li>
                          ))}
                      </ul>
                  </nav>
              }
          </body>
=======
          {seg !== "quote" && (
            <header className={styles.header}>
              <Image src={logo} alt="Antes Logo" height={24} />
              <div className={styles.cornerSquare}></div>
            </header>
          )}
          <div className={styles.container}>{children}</div>
        </div>
        {seg !== "quote" && (
          <nav className={styles.nav}>
            <ul className={styles.list}>
              {seg !== "login" &&
                navItems.map((p) => (
                  <Link key={p.path} href={`/${p.path}`} title={p.path}>
                    <li className={clsx(styles.listItem, p.path === seg && styles.active)}>
                      <div className={styles.navItem}>
                        <span className={styles.hoverText}>{p.name}</span>
                        <i className="symbol">{p.symbol}</i>
                      </div>
                    </li>
                  </Link>
                ))}
            </ul>
          </nav>
        )}
      </body>
>>>>>>> main
    </html>
  );
}