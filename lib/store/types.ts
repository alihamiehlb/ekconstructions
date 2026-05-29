export type EnquiryStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export type Enquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  sourceIp?: string;
  status?: EnquiryStatus;
  notes?: string;
  readAt?: string;
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
    byStatus?: { status: string; count: number }[];
    unread?: number;
  };
  pageViews: {
    total: number;
    last7Days: { date: string; count: number }[];
  };
  conversionRate: number;
  recentEnquiries: Enquiry[];
  storage: "supabase" | "file";
};

export type AdminUser = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  active: boolean;
  lastLogin?: string;
};

export type BusinessClient = {
  id: string;
  createdAt: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
};

export type OrderStatus =
  | "draft"
  | "quoted"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export type BusinessOrder = {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientId?: string;
  enquiryId?: string;
  title: string;
  status: OrderStatus;
  description?: string;
  revenueCents: number;
  costCents: number;
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export type BusinessInvoice = {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderId?: string;
  clientId?: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  amountCents: number;
  gstCents: number;
  totalCents: number;
  dueDate?: string;
  notes?: string;
};

export type BusinessStats = {
  revenueCents: number;
  costCents: number;
  marginCents: number;
  marginPercent: number;
  ordersTotal: number;
  ordersActive: number;
  invoicesTotal: number;
  invoicesPaid: number;
  invoicesOutstandingCents: number;
  clientsTotal: number;
};
