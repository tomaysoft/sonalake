import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { CharacterService } from 'src/app/services/character-service.service';

@Component({
  selector: 'sl-characters-table',
  templateUrl: './characters-table.component.html',
  styleUrls: ['./characters-table.component.scss']
})
export class CharactersTableComponent implements OnDestroy {
  subscription: Subscription;
  characters = [];
  loading = false;
  sort = {
    id: 'none',
    name: 'none',
    species: 'none',
    gender: 'none',
    homeworld: 'none'
  };
  sortingType = ['none', 'asc', 'desc'];

  constructor(private messageService: MessageService, private charactersService: CharacterService) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message.query) {
        this.characters = message.query.characters;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  delete(id) {
    this.messageService.sendMessage({delete: id});
  }

  getNextSortType(type) {
    let sortTypeIdx = this.sortingType.indexOf(type);
    sortTypeIdx++;
    if (sortTypeIdx === this.sortingType.length) {
      sortTypeIdx = 0;
    }
    return this.sortingType[sortTypeIdx];
  }
  setSorting(field) {
    const currentSorting = this.sort[field];
    this.sort[field] = this.getNextSortType(this.sort[field]);
    this.messageService.sendMessage({sort: this.sort});
  }
}
