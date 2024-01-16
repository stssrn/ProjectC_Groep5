"use client";

import "./globals.css";
import styles from "./layout.module.css";
import clsx from "clsx";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from './providers';
import RoleBasedNavbar from "./components/RoleBasedNavbar";

const inter = Inter({ subsets: ["latin"] });

const materialSymbols = localFont({
  variable: "--font-family-symbols", // Variable name (to reference after in CSS/styles)
  style: "normal",
  src: "../node_modules/material-symbols/material-symbols-rounded.woff2", // This is a reference to woff2 file from NPM package "material-symbols"
  display: "block",
  weight: "100 700",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, styles.body, materialSymbols.variable)}>
        <Providers>
          <RoleBasedNavbar>
            {children}
          </RoleBasedNavbar>
        </Providers>
      </body>

    </html>
  );
}