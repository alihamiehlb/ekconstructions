export type Enquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  sourceIp?: string;
};

export type PageView = {
  id: string;
  createdAt: string;
  path: string;
  referrer?: string;
};

export type AdminStats = {
  enquiries: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    byService: { service: string; count: number }[];
  };
  pageViews: {
    total: number;
    last7Days: { date: string; count: number }[];
  };
  conversionRate: number;
  recentEnquiries: Enquiry[];
  storage: "supabase" | "file";
};
