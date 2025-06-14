"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdBugReport } from "react-icons/md";
import classNames from "classnames";
import { useStore } from "../store/store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const NavBar = () => {
  const currPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Map", href: "/map" },
    { label: "Stats", href: "/stats" },
    { label: "Analyze", href: "/sentiment" },
  ];

  const { theme, setTheme, toggleTheme } = useStore(); // Get the current theme and toggle function

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
                      "text-white": link.href === currPath,
                      "text-neutral-600": link.href !== currPath,
                      "hover:text-cyan-200 transition-colors": true,
                    })
                  : classNames({
                      "text-black": link.href === currPath,
                      "text-zinc-500": link.href !== currPath,
                      "hover:text-cyan-400 transition-colors": true,
                    })
              }
              href={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </ul>
      <div className="ml-auto space-x-4">
        <Switch
          id="toggle-theme"
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
        />
        <Label htmlFor="toggle-theme">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </Label>
      </div>
    </nav>
  );
};
