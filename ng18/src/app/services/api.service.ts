import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of, switchMap, throwError} from 'rxjs';

import {environment} from '../../environments/environment';
import {TicketPageResponse} from '../model/ticket-page-response';
import {Ticket} from "../model/ticket";
import ticketListResponse from '../mocks/list.json'
import {UserParameter} from "../model/user-parameter";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);
  private userParamsId = '019968ad-c5b6-7011-b8fa-d1e235ec2a7e'; // user parameter: favoriteTickets

  getFavoriteTickets(): Observable<TicketPageResponse> {
    return this.http.get<UserParameter>(
      `${environment.BASE_URL}/tsm-user-management/api/v2/user-parameters/${this.userParamsId}`
    )
      .pipe(
        map(response => {
          try {
            return JSON.parse(response.parameterValue);
          } catch (ex) {
            return [];
          }
        }),
        switchMap((favoriteTickets) => {
          const ticketIds = favoriteTickets && [...favoriteTickets].join(',');

          return this.getTicketList(ticketIds)
        }),
        // Následující kód je třeba brát v úvahu pouze v kontextu demo projektu.
        // V reálném projektu bych se rozhodl buď pro interceptor, nebo pro vhodnou knihovnu,
        // v závislosti na úkolu.
        catchError(error => {
          if (error.status === 401) {
            return of(ticketListResponse)
          }

          //TODO: přidat errorHandler přes interceptor
          return throwError(() => error);
        })
      )
  }

  private getTicketList(ticketIds: string): Observable<TicketPageResponse> {
    return this.http.get<TicketPageResponse>(
      `${environment.BASE_URL}/tsm-ticket/api/v2/tickets/page?key__in=${ticketIds}`
    )
  }

  updateFavoriteTickets(ticketIds: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/tsm-user-management/api/user-parameter/${this.userParamsId}`, ticketIds)
  }
}
