"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdBugReport } from "react-icons/md";
import classNames from "classnames";
import { useStore } from "../store/store";

export const NavBar = () => {
  const currPath = usePathname();
  console.log(currPath);

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Map", href: "/map" },
    { label: "Stats", href: "/stats" },
    { label: "Analyze my Kudos", href: "/sentiment" },
  ];

  const { theme, setTheme, toggleTheme } = useStore(); // Get the current theme and toggle function

  console.log(theme);

  // Update the body data-theme attribute whenever theme changes
  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) setTheme(stored);
  }, [setTheme]);

  return (
    <nav className="flex space-x-6 borber-b px-5 h-14 items-center">
      <Link href={"/"}>
        <MdBugReport />
      </Link>
      <ul className="flex space-x-6 flex-grow">
        {links.map((link) => {
          return (
            <Link
              key={link.href}
              className={
                theme === "dark"
                  ? classNames({
                      "text-zinc-900": link.href === currPath,
                      "text-neutral-600": link.href !== currPath,
                      "hover:text-red-800 transition-colors": true,
                    })
                  : classNames({
                      "text-white": link.href === currPath,
                      "text-zinc-500": link.href !== currPath,
                      "hover:text-rose-800 transition-colors": true,
                    })
              }
              href={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </ul>
      <div className="ml-auto">
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
    </nav>
  );
};
