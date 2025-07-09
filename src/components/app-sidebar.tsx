"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartDotsFilled,
  IconFileAi,
  IconFileDescription,
  IconLayoutDashboard,
  IconOutbound,
  IconPigMoney,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
      release: true
    },
    {
      title: "Outreach",
      url: "/outreach",
      icon: IconOutbound,
      release: true
    },
    {
      title: "Tracking",
      url: "/tracking",
      icon: IconChartDotsFilled,
      release: false
    },
    {
      title: "Finances",
      url: "/finances",
      icon: IconPigMoney,
      release: true
    },
    {
      title: "Team",
      url: "/team",
      icon: IconUsers,
      release: false
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "/capture",
      items: [
        {
          title: "Active Proposals",
          url: "/capture/active-proposals",
        },
        {
          title: "Archived",
          url: "/capture/archived",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Avatar>
                  <AvatarImage src="https://scontent-vie1-1.xx.fbcdn.net/v/t1.15752-9/494358496_721119096934062_2407957895414382542_n.png?stp=dst-png_s100x100&_nc_cat=105&ccb=1-7&_nc_sid=b70caf&_nc_ohc=Du9rmpJBBBAQ7kNvwF--xUj&_nc_oc=AdlI1f_3y-MtOmSsk-I0Y_vXlZeU_KgQlISK96hcKeLIoDyr6BjmAXzGbHlUQP9C6hlIuS9EXx7S_1mPFMhfIqk9&_nc_zt=23&_nc_ht=scontent-vie1-1.xx&oh=03_Q7cD2gG8eiB6M74Q6Bpt1QtpykEkAlpA3aHwSr4tW7m8YPGKkw&oe=688DEFA0" />
                  <AvatarFallback>PA</AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold align-middle ml-2">Prometheus Agency</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
