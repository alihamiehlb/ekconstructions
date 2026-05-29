/** Strip Instagram og:description boilerplate (likes, username, date). */
export function parseInstagramOgDescription(raw: string): string {
  const decoded = decodeHtmlEntities(raw).trim();
  if (!decoded) return "";

  const quoted = decoded.match(/:\s*"([^"]+)"\.?\s*$/);
  if (quoted?.[1]) return cleanCaption(quoted[1]);

  const afterColon = decoded.match(/:\s*(.+)$/);
  if (afterColon?.[1] && !/^[\d,]+ likes/i.test(afterColon[1])) {
    return cleanCaption(afterColon[1].replace(/^["']|["']\.?$/g, ""));
  }

  if (/^[\d,]+ likes/i.test(decoded)) return "";
  return cleanCaption(decoded);
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\u0026/g, "&")
    .replace(/\\n/g, "\n")
    .replace(/\\\//g, "/");
}

export function cleanCaption(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/(?:^|\s)#[\w\u0080-\uFFFF]+/g, "")
    .trim();
}

export function titleFromCaption(caption: string): string {
  const cleaned = cleanCaption(caption);
  const line = cleaned.split("\n").find((l) => l.trim().length > 0)?.trim() ?? "";
  if (!line) return "EK Constructions project";
  const withoutHashtags = line.replace(/#\w+/g, "").trim();
  const title = withoutHashtags || line;
  return title.length > 72 ? `${title.slice(0, 69)}…` : title;
}

export function descriptionFromCaption(caption: string): string {
  const cleaned = cleanCaption(caption);
  if (!cleaned) {
    return "Completed work by EK Constructions — see more on our Instagram.";
  }
  return cleaned.length > 480 ? `${cleaned.slice(0, 477)}…` : cleaned;
}

export function inferCategoryFromCaption(caption: string): string {
  const rules: { category: string; keywords: RegExp }[] = [
    { category: "Glass Balustrade", keywords: /balustrad|glass rail|stair|void|frameless/i },
    { category: "Aluminium Windows", keywords: /window|glaz|facade|door|alumin/i },
    { category: "Privacy Screens", keywords: /privacy|slat|screen|gate|fence/i },
    { category: "Carpentry", keywords: /kitchen|joinery|carpent|fit-?out|cabinet|deck/i },
    { category: "Steel Work", keywords: /steel|weld|structural/i },
  ];

  for (const { category, keywords } of rules) {
    if (keywords.test(caption)) return category;
  }
  return "Recent Work";
}
