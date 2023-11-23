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
  { path: "gebruiker", symbol: "person" },
  { path: "dashboard", symbol: "dashboard" },
  { path: "agenda", symbol: "calendar_month" },
  { path: "forum", symbol: "forum" },
  // { path: "quiz", symbol: "quiz" },
  { path: "winkel", symbol: "shopping_cart" },
  { path: "admin", symbol: "shield" },
  { path: "instellingen", symbol: "settings" },
  { path: "faq", symbol: "help" },
  { path: "contact", symbol: "call" },
  { path: "casussen", symbol: "book" }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seg = useSelectedLayoutSegment();
  return (
    <html lang="en">
      <body
        className={clsx(inter.className, styles.body, materialSymbols.variable)}
          >

        <div className={styles.wrapper}>
                  {seg !== "quote" &&
                      <header className={styles.header}>
                          <Image src={logo} alt="Antes Logo" height={24}></Image>
                          <div className={styles.cornerSquare}></div>
                      </header>
                  }
          <div className={styles.container}>{children}</div>
              </div>
              {seg !== "quote" &&
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
    </html>
  );
}
