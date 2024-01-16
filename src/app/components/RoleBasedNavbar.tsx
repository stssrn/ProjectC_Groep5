"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";
import styles from "../layout.module.css";
import logo from "../logo.svg";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSession } from "next-auth/react";

const navItems = [
  { path: "gebruiker", symbol: "person", name: "Profiel" },
  { path: "dashboard", symbol: "dashboard", name: "Dashboard" },
  { path: "agenda", symbol: "calendar_month", name: "Agenda" },
  { path: "forum", symbol: "forum", name: "Forum" },
  { path: "quiz", symbol: "quiz", name: "Quiz" },
  { path: "winkel", symbol: "shopping_cart", name: "Winkel" },
  { path: "admin", symbol: "shield", name: "admin" },
  { path: "casussen", symbol: "book", name: "Casus" },
  { path: "educatie", symbol: "school", name: "Educatie" },
  { path: "faq", symbol: "help", name: "FAQ" },
  { path: "contact", symbol: "call", name: "Contact" },
  { path: "signout", symbol: "logout", name: "Uitloggen" }
];

export default function RoleBasedNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  const seg = useSelectedLayoutSegment();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  const filteredNavItems = isAdmin
    ? navItems.filter(item => item.path === 'admin' || item.path === 'signout')
    : navItems.filter(item => item.path !== 'admin');

  return (
    <>
      <div className={styles.wrapper}>

        {seg !== "quote" && seg !== "ggzinfo" &&
          <header className={styles.header}>
            <Image src={logo} alt="Antes Logo" height={24}></Image>
            <div className={styles.cornerSquare}></div>
          </header>
        }
        <div className={styles.container}>
          {children}
        </div>
      </div>
      {seg !== "quote" && seg !== "ggzinfo" &&
        <nav className={styles.nav}>
          <ul className={styles.list}>
            {seg !== "login" && filteredNavItems.map((p) => (
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
      }</>
  );
}