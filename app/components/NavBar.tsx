"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdBugReport } from "react-icons/md";
import classNames from "classnames";

export const NavBar = () => {
  const currPath = usePathname();
  console.log(currPath);

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];

  return (
    <nav className="flex space-x-6 borber-b px-5 h-14 items-center">
      <Link href={"/"}>
        <MdBugReport />
      </Link>
      <ul className="flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            className={classNames({
              "text-zinc-900": link.href === currPath,
              "text-zinc-500": link.href !== currPath,
              "hover:text-zinc-800 transition-colors": true,
            })}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};
