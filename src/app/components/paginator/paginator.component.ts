import { Component, OnDestroy } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sl-paginator',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnDestroy {
  isVisible: boolean;
  subscription: Subscription;
  links = {
    prev: null,
    next: null,
    first: null,
    last: null,
    lp: null,
    fp: null,
    pp: null,
    np: null
  };
  pages = [];

  constructor(private messageService: MessageService) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message.query) {
        this.links = message.query.paging;
        this.pages = [];
        if (this.links.lp !== this.links.fp) {
          this.isVisible = true;
          for (let i = <number>this.links.fp; i <= <number>this.links.lp; i++) {
            this.pages.push(i);
          }
        } else {
          this.isVisible = false;
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadPage(pageNo) {
    this.messageService.sendMessage({loadPage: pageNo});
  }
}
