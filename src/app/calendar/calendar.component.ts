import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  // Možeš držati kao Date, ali input daje string
  selectedDate: Date = new Date();

  // Emitujemo izabrani datum kao string u formatu "YYYY-MM-DD"
  @Output() dateChanged = new EventEmitter<string>();

  onDateChange(event: any) {
    const dateStr: string = event.target.value; // dateStr npr. "2025-04-13"
    this.selectedDate = new Date(dateStr);
    this.dateChanged.emit(dateStr);
  }
}
