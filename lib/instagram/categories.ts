const RULES: { category: string; keywords: RegExp }[] = [
  { category: "Glass Balustrade", keywords: /balustrad|glass rail|stair|void/i },
  { category: "Aluminium Windows", keywords: /window|glaz|facade|door/i },
  { category: "Privacy Screens", keywords: /privacy|slat|screen|gate|fence/i },
  { category: "Carpentry", keywords: /kitchen|joinery|carpent|fit-?out|cabinet/i },
];

export function inferCategoryFromCaption(caption: string): string {
  for (const { category, keywords } of RULES) {
    if (keywords.test(caption)) return category;
  }
  return "Recent Work";
}

export function titleFromCaption(caption: string): string {
  const line = caption.split("\n")[0]?.trim() ?? "";
  if (!line) return "Instagram project";
  return line.length > 72 ? `${line.slice(0, 69)}…` : line;
}
