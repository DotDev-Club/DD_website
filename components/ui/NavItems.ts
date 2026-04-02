export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

const navItems: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Events", href: "/events" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "Workshops", href: "/workshops" },
  { label: "Gallery", href: "/gallery" },
];

export default navItems;
