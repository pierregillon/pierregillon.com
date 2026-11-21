"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarsIcon } from "@/components/icons";
import { isCurrentPage, navigation } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-95 bg-violet-dark px-[5%] lg:px-[8%]">
      <div className="boxed flex min-h-[70px] items-stretch justify-between px-2.5 py-2.5 md:px-5">
        <Link href="/" aria-label="Pierre Gillon – Accueil" className="flex items-center self-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.webp"
            width={240}
            height={161}
            alt="Pierre Gillon"
            className="h-[50px] w-auto object-contain md:h-[30px] lg:h-9"
          />
        </Link>

        {/* Menu desktop */}
        <nav aria-label="Navigation principale" className="hidden h-[50px] items-start pt-px lg:flex">
          <ul className="inline-flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrentPage(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "block px-5 text-base leading-6 font-light text-white transition-colors duration-200 hover:text-orange",
                    isCurrentPage(pathname, item.href) && "bg-violet-light",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Menu mobile / tablette */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="mt-px flex h-[42px] cursor-pointer items-center bg-orange px-2.5 py-[5px] text-white"
          >
            <span className="sr-only">Ouvrir ou fermer le menu</span>
            <BarsIcon className="w-[26px]" />
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Navigation mobile"
        hidden={!open}
        className="absolute inset-x-0 top-16 lg:hidden"
      >
        <ul>
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isCurrentPage(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "block px-5 py-2.5 text-sm leading-[21px] font-light text-white transition-colors duration-200 hover:bg-orange",
                  isCurrentPage(pathname, item.href) ? "bg-orange" : "bg-[#030303]",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
