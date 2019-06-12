import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'sl-search-field',
  templateUrl: './search-field.component.html'
})
export class SearchFieldComponent implements OnInit {
  private subject: Subject<string> = new Subject();

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe(searchValue => {
      const msg = searchValue ? {filter: searchValue} : {emptyFilter: true};
      this.messageService.sendMessage(msg);
    });
  }

  onKeyup(event: any) {
    const searchValue = event.target.value.trim().toLowerCase();
    this.subject.next(searchValue);
  }
}
