import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, EMPTY, Observable, of, throwError} from 'rxjs';

import {environment} from '../../environments/environment';
import {TicketPageResponse} from '../model/ticket-page-response';
import {Ticket} from "../model/ticket";
import ticketListResponse from '../mocks/list.json'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  getTicketList(tickets = 'TICK_7,TICK_6'): Observable<TicketPageResponse> {
    return this.http.get<TicketPageResponse>(
      `${environment.BASE_URL}/tickets/page?key__in=${tickets}`
    )
      // Následující kód je třeba brát v úvahu pouze v kontextu demo projektu.
      // V reálném projektu bych se rozhodl buď pro interceptor, nebo pro vhodnou knihovnu,
      // v závislosti na úkolu.
      .pipe(catchError(error => {
        if (error.status === 401) {
          return of(ticketListResponse)
        }

        //TODO: přidat errorHandler přes interceptor
        return throwError(() => error);
      }))
  }

  postTicket(ticket: Ticket): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/tickets/`, {ticket})
  }

  deleteTicket(ticketId: string): Observable<any> {
    return this.http.delete(`${environment.BASE_URL}/tickets/${ticketId}`)
  }
}
