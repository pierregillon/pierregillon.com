"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrentPage, navigation } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Liens du pied de page" className="bg-[#6b24db]">
      <ul>
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "font-open block leading-[1.7] font-semibold text-white transition-colors duration-100 hover:text-[#f5b147]",
                isCurrentPage(pathname, item.href) && "bg-violet-light",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
