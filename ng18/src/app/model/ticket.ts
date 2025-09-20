import {AuditInfo} from "./audit-info";

export interface Ticket {
  id: string;
  key: string;
  name: string;
  description?: string;
  type: string;
  channel: string;
  severity: string;
  status: string;
  priority: string;
  category: string;
  creationUser: string;
  chars: Record<string, unknown>;
  dataTags: string[];
  creationDate: string; // ISO timestamp
  auditInfo: AuditInfo;
  deletePending?: boolean
}
