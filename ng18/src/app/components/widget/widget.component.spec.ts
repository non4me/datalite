import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
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

        await TestBed.configureTestingModule({
            imports: [WidgetComponent],
            providers: [
                {provide: TicketService, useValue: mockTicketService}
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WidgetComponent);
        component = fixture.componentInstance;

    mockTicketService.getList.and.returnValue(of(mockTickets));
    mockTicketService.updateFavoriteTickets.and.returnValue(of(null));

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

    it('should delete ticket when not pending', () => {
        const ticketToDelete = mockTickets[0];

        component.deleteTicket(ticketToDelete);

        expect(ticketToDelete.deletePending).toBe(true);
        expect(mockTicketService.updateFavoriteTickets).toHaveBeenCalledWith(JSON.stringify([mockTickets[1].key]));
    });

    it('should not delete ticket when already pending', () => {
        const ticketToNotDelete = mockTickets[0];
        ticketToNotDelete.deletePending = true;

        component.deleteTicket(ticketToNotDelete);

        expect(ticketToNotDelete.deletePending).toBe(true);
        expect(mockTicketService.updateFavoriteTickets).not.toHaveBeenCalled();
    });

    it('should add new ticket', () => {
        const initialCount = component.tickets.length;

        component.add();

        expect(component.tickets.length).toBe(initialCount + 1);
        expect(mockTicketService.updateFavoriteTickets).toHaveBeenCalled();
    });
});
