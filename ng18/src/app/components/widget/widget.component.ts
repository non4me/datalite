import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Component, inject} from '@angular/core';
import {catchError, EMPTY, take} from "rxjs";
import {CommonModule} from "@angular/common";
import {TableModule} from "primeng/table";
import {Button} from 'primeng/button';

import {Ticket, CustomTicket} from '../../model/ticket';
import {TicketService} from '../../services/ticket.service';
import {SafeHtmlPipe} from '../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [TableModule, CommonModule, SafeHtmlPipe, Button],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss'
})
export class WidgetComponent {
  tickets!: CustomTicket[];
  newTicket!: CustomTicket;

  private dataService = inject(TicketService);

  constructor() {
    this.dataService.getList()
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.tickets = [...data] as CustomTicket[];
        this.newTicket = this.tickets[0];
      })
  }

  deleteTicket(ticket: CustomTicket): void {
    if (!ticket.deletePending) {
      ticket.deletePending = true;
      this.dataService.deleteTicket(ticket)
        .pipe(
          take(1),
          catchError(() => {
            // pouze pro demo, ala mock
            this.tickets = [...this.tickets.filter(item => item !== ticket)];

            return EMPTY;
          })
        )
        .subscribe(() => {
          ticket.deletePending = false;
          this.tickets = [...this.tickets.filter(item => item !== ticket)];
        })
    }
  }

  add(): void {
    // TODO: Potřebuji specifikaci pro <tsm-ticket-lov>
    // dočasné řešení pouze pro fungování UI
    const newTicket = {
      ...this.newTicket,
      id: '' + Math.random(),
      key: 'TICK_' + Date.now(),
      description: '' + Math.random()
    }

    this.tickets = [...this.tickets, newTicket]
  }
}
