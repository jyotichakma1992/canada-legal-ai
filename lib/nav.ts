import { PROVINCE_GUIDES } from "@/lib/provinces";

export const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const PROVINCE_LINKS = PROVINCE_GUIDES.map((guide) => ({
  href: `/${guide.slug}`,
  label: guide.name,
}));

export const LEGAL_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;

export const CONTACT_EMAIL = "hello@canadalegal.ai";
