export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

const navItems: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Events", href: "/events" },
  { label: "Projects", href: "/projects" },
  { label: "Workshops", href: "/workshops" },
  { label: "Sprints", href: "/sprints" },
  { label: "Open Source", href: "/open-source" },
  { label: "Blog", href: "/blog" },
];

export default navItems;
