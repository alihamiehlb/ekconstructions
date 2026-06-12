import {
  Award,
  CalendarClock,
  Fence,
  Layers,
  PanelTop,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  window: PanelTop,
  balustrade: Layers,
  steel: PanelTop,
  fence: Fence,
  team: Users,
  shield: ShieldCheck,
  tools: Wrench,
  calendar: CalendarClock,
  badge: Award,
};

export function ServiceIcon({
  name,
  className = "h-8 w-8",
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? PanelTop;
  return <Icon className={className} strokeWidth={1.15} aria-hidden />;
}
