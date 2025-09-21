import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';

import {TicketService} from './ticket.service';
import {ApiService} from './api.service';
import {TicketPageResponse} from '../model/ticket-page-response';

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(() => {
    const mockApiService = jasmine.createSpyObj('ApiService', ['getFavoriteTickets', 'updateFavoriteTickets']);
    TestBed.configureTestingModule({
      providers: [
        TicketService,
        {provide: ApiService, useValue: mockApiService}
      ]
    });
    service = TestBed.inject(TicketService);
  });

  it('should call ApiService.getFavoriteTickets when getList is called', (done) => {
    const mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    const mockTicket = {content: [{id: '1', name: 'Test Ticket'}]} as TicketPageResponse
    mockApiService.getFavoriteTickets.and.returnValue(of(mockTicket));

    service.getList().subscribe((tickets) => {
      expect(tickets.length).toBe(1);
      expect(tickets[0].name).toBe('Test Ticket');
      expect(mockApiService.getFavoriteTickets).toHaveBeenCalled();
      done();
    });
  });

  it('should call ApiService.updateFavoriteTickets with the correct parameter when updateFavoriteTickets is called', () => {
    const mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    const mockTicketIds = '123';
    mockApiService.updateFavoriteTickets.and.returnValue(of(null));

    service.updateFavoriteTickets(mockTicketIds).subscribe(() => {
      expect(mockApiService.updateFavoriteTickets).toHaveBeenCalledWith(mockTicketIds);
    });
  });
});
