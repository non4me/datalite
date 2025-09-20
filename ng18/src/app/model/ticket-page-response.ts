import {Ticket} from "./ticket";

export interface TicketPageResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: Ticket[];
}
