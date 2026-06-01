type Props = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
};

export function StaggerReveal({ children, className = "" }: Props) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
