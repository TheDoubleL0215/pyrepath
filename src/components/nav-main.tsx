"use client"

import { usePathname, useRouter } from "next/navigation"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon,
    release: boolean
  }[]
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <SidebarMenu className="p-1.5">
      {items.map((item) => (
        <SidebarMenuButton key={item.title}
          disabled={!item.release}
          isActive={pathname == item.url && true}
          className="cursor-pointer"
          tooltip={item.title}
          onClick={() => router.push(item.url)}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      ))}
    </SidebarMenu>
  )
}
