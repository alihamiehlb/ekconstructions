type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function SectionReveal({ children, className = "" }: Props) {
  return <div className={className}>{children}</div>;
}
