import {ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {of} from 'rxjs';

import {WidgetComponent} from './widget.component';
import {TicketService} from '../../services/ticket.service';
import {CustomTicket} from '../../model/ticket';

describe('WidgetComponent', () => {
    let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;
  let mockTicketService: jasmine.SpyObj<TicketService>;

  const mockTickets = [
      {
          id: '1',
          key: 'TICK_1',
          description: 'Ticket 1',
          deletePending: false
      },
      {
          id: '2',
          key: 'TICK_2',
          description: 'Ticket 2',
          deletePending: false
      }
  ] as CustomTicket[];

    beforeEach(async () => {
        mockTicketService = jasmine.createSpyObj<TicketService>('TicketService', ['getList', 'updateFavoriteTickets']);
    mockTicketService.getList.and.returnValue(of(mockTickets));
    mockTicketService.updateFavoriteTickets.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [WidgetComponent],
            providers: [
                { provide: TicketService, useValue: mockTicketService }
            ]
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize tickets from service', inject([TicketService], (service: TicketService) => {
        expect(service.getList).toHaveBeenCalled();
        expect(component.tickets).toEqual(mockTickets);
        expect(component.newTicket).toEqual(mockTickets[0]);
    }));

    it('should delete ticket when not pending', fakeAsync(() => {
        // Setup services to ensure fresh component state
        const ticket1 = { id: '1', key: 'TICK_1', description: 'Ticket 1', deletePending: false } as CustomTicket;
        const ticket2 = { id: '2', key: 'TICK_2', description: 'Ticket 2', deletePending: false } as CustomTicket;
        const tickets = [ticket1, ticket2];
        mockTicketService.getList.and.returnValue(of(tickets));
        fixture = TestBed.createComponent(WidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // Call method on ticket in the component's own tickets list!
        const ticketToDelete = component.tickets[0];
        component.deleteFromFavorites(ticketToDelete);
        tick();

        // Should set deletePending=false after observable resolves
        expect(ticketToDelete.deletePending).toBe(false);
        // Only one ticket should remain in tickets array
        expect(component.tickets.length).toBe(1);
        expect(component.tickets[0].key).toBe(ticket2.key);
        expect(mockTicketService.updateFavoriteTickets).toHaveBeenCalledOnceWith(JSON.stringify([ticket2.key]));
    }));

    it('should not delete ticket when already pending', () => {
        const ticketToNotDelete = mockTickets[0];
        ticketToNotDelete.deletePending = true;

        component.deleteFromFavorites(ticketToNotDelete);

        expect(ticketToNotDelete.deletePending).toBe(true);
        expect(mockTicketService.updateFavoriteTickets).not.toHaveBeenCalled();
    });

    it('should add new ticket', () => {
        const initialCount = component.tickets.length;

        component.addToFavorites();

        expect(component.tickets.length).toBe(initialCount + 1);
        expect(mockTicketService.updateFavoriteTickets).toHaveBeenCalled();
    });
});
