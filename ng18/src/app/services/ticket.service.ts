import {inject, Injectable} from '@angular/core';
import {map, Observable} from "rxjs";

import {Ticket} from "../model/ticket";
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private api = inject(ApiService);

  getList(): Observable<Ticket[]> {
    return this.api.getTicketList().pipe(
      map(response => response.content)
    )
  }

  createTicket(ticket: Ticket): Observable<any> {
    return this.api.postTicket(ticket);
  }

  deleteTicket(ticket: Ticket): Observable<any> {
    return this.api.deleteTicket(ticket.id);
  }
}
