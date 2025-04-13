import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentYear!: number;
  currentMonth!: number; // 0-11
  weeks: any[] = [];
  allEvents: any[] = [];

  selectedDayEvents: any[] = [];

  // Modal states
  showModal = false;
  selectedEvent: any = null; // Vest koja se prikazuje u modalu

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();

    // Napomena: getNews() treba vraćati i buduće vesti (status='approved')
    this.newsService.getNews().subscribe({
      next: (data) => {
        this.allEvents = data;
        this.generateCalendar(this.currentYear, this.currentMonth);
      },
      error: (err) => console.error('Error loading news:', err)
    });
  }

  generateCalendar(year: number, month: number) {
    this.weeks = [];
  
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
  
    // Ponedeljak kao prvi dan: startDay=0 => offset=6, inače startDay-1
    const startDay = firstDayOfMonth.getDay();
    const offset = (startDay === 0) ? 6 : (startDay - 1);
  
    let dayCounter = 1 - offset;
  
    // Kreiramo sedmice dok ne dođemo do zadnjeg dana
    while (true) {
      const week: any[] = [];
  
      for (let i = 0; i < 7; i++) {
        // Ako smo prešli poslednji dan u mesecu, prekinemo punjenje ove sedmice
        if (dayCounter > daysInMonth) {
          break;
        }
  
        const currentDate = new Date(year, month, dayCounter);
        const inMonth = (dayCounter >= 1 && dayCounter <= daysInMonth);
  
        let dayEvents: any[] = [];
        if (inMonth) {
          dayEvents = this.allEvents.filter(ev => {
            const evDate = new Date(ev.date);
            return evDate.getFullYear() === year &&
                   evDate.getMonth() === month &&
                   evDate.getDate() === dayCounter;
          });
        }
  
        week.push({
          day: inMonth ? dayCounter : '',
          inMonth,
          date: currentDate,
          events: dayEvents
        });
  
        dayCounter++;
      }
  
      // Ako u ovoj sedmici nema nijednog dana meseca, prekidamo (ne ubacuj sedmicu)
      if (week.length === 0 || dayCounter > daysInMonth + 1) {
        break;
      }
  
      this.weeks.push(week);
  
      // Ako smo već prešli sve dane, prekidamo
      if (dayCounter > daysInMonth) {
        break;
      }
    }
  }
  

  prevMonth(): void {
    this.selectedDayEvents = [];
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  nextMonth(): void {
    this.selectedDayEvents = [];
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  get monthName(): string {
    const months = [
      'Jan','Feb','Mar','Apr','Maj','Jun',
      'Jul','Avg','Sep','Okt','Nov','Dec'
    ];
    return months[this.currentMonth];
  }

  selectDay(dayObj: any): void {
    if (!dayObj.inMonth || !dayObj.day) {
      this.selectedDayEvents = [];
      return;
    }
    // Izbriši trenutno prikazane vijesti kako bi se element uklonio iz DOM-a
    this.selectedDayEvents = [];
    // Nakon kratkog perioda (50ms), postavi vijesti za taj dan
    setTimeout(() => {
      this.selectedDayEvents = dayObj.events;
    }, 50);
  }
  

  // Kad kliknemo na pojedinačnu vest (karticu)
  openModal(eventItem: any): void {
    this.selectedEvent = eventItem;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedEvent = null;
  }
}
