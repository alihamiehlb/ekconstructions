import { readCmsUncached } from "@/lib/cms/read-cms";
import type { CmsData } from "@/lib/cms/types";
import { unstable_cache } from "next/cache";

export const CMS_CACHE_TAG = "cms";

const readCmsCached = unstable_cache(
  async () => readCmsUncached(),
  ["cms-content"],
  { revalidate: 60, tags: [CMS_CACHE_TAG] },
);

export async function readCms(): Promise<CmsData> {
  return readCmsCached();
}
