import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TableModule} from "primeng/table";

import {Ticket, CustomTicket} from '../../model/ticket';
import {TicketService} from '../../services/ticket.service';
import {SafeHtmlPipe} from '../../shared/pipes/safe-html.pipe';
import {Button} from 'primeng/button';
import {catchError, EMPTY, take} from "rxjs";

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [TableModule, CommonModule, SafeHtmlPipe, Button],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss'
})
export class WidgetComponent {
  tickets!: CustomTicket[];
  pendingAdd = false

  private dataService = inject(TicketService);

  constructor() {
    this.dataService.getList()
      .pipe(takeUntilDestroyed())
      .subscribe(data => this.tickets = [...data] as CustomTicket[])
  }

  deleteTicket(ticket: CustomTicket): void {
    if(!ticket.deletePending) {
      ticket.deletePending = true;
      this.dataService.deleteTicket(ticket)
        .pipe(
          take(1),
          catchError(() => {
            // pouze pro demo, ala mock
            this.tickets = [...this.tickets.filter(item => item !== ticket)];

            return  EMPTY;
          })
        )
        .subscribe(() => {
          ticket.deletePending = false;
          this.tickets = [...this.tickets.filter(item => item !== ticket)]
        })
    }
  }

  add(): void {
    console.log('add')
  }
}
