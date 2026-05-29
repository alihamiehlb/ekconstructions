import { revalidatePath } from "next/cache";

/** Bust static cache so Instagram gallery updates appear on the live site immediately. */
export function revalidateSiteGallery(): void {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/gallery", "layout");
}
