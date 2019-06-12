import { Component, OnDestroy, OnInit } from '@angular/core';
import { CharacterService } from 'src/app/services/character-service.service';
import { MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sl-list-view',
  templateUrl: './list-view.component.html'
})
export class ListViewComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  characters;
  links = {
    firstPage: null,
    prevPage: null,
    nextPage: null,
    lastPage: null
  };
  linksInit = this.links;
  query;
  charactersCount = 0;


  constructor( private characterService: CharacterService, private messageService: MessageService ) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message.loadPage) {
        this.characterService.getPage(message.loadPage);
        this.readCharactersData();
      }
      if (message.filter) {
        this.characterService.searchCharacter(message.filter);
        this.readCharactersData();
      }
      if (message.emptyFilter) {
        this.characterService.searchCharacter();
        this.readCharactersData();
      }
      if (message.delete) {
        this.deleteCharacter(message.delete);
      }
      if (message.sort) {
        this.characterService.setSort(message.sort);
        this.readCharactersData();
      }
    });
  }

  ngOnInit() {
    this.readCharactersData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  readCharactersData() {
    this.characterService.getCharacters().subscribe(response => {
      this.retrievePaginationLinks(response);
      this.characters = response.body;
      this.charactersCount = this.characters.length;
      this.sendMessage();
    });
  }

  deleteCharacter(id) {
    this.characterService.deleteCharacter(id).subscribe(response => {
      this.readCharactersData();
    });
  }

  getPageNoFromUrl(url) {
    const decodeURLParams = search => {
      const hashes = search.slice(search.indexOf('?') + 1).split('&');
      return hashes.reduce((params, hash) => {
        const split = hash.indexOf('=');
        const key = hash.slice(0, split);
        const val = hash.slice(split + 1);
        return Object.assign(params, { [key]: decodeURIComponent(val) });
      }, {});
    };
    return decodeURLParams(url)['_page'];
  }

  parseLinkHeader(header) {
    if (header.length === 0) {
      return ;
    }
    const parts = header.split(', ');
    const links = {};
    parts.forEach( p => {
      const section = p.split(';');
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });
    links['fp'] = this.getPageNoFromUrl(links['first']);
    links['lp'] = this.getPageNoFromUrl(links['last']);
    links['pp'] = links['prev'] ? this.getPageNoFromUrl(links['prev']) : null;
    links['np'] = links['next'] ? this.getPageNoFromUrl(links['next']) : null;
    return links;
  }

  retrievePaginationLinks(response) {
    const header = response.headers.get('Link');
    let linkHeader = null;
    if (header) {
      linkHeader = this.parseLinkHeader(response.headers.get('Link'));
      this.links = linkHeader;
    } else {
      this.links = this.linksInit;
    }
}

  prepareMessage(): Object {
    return { query :
      {
        characters: this.characters || [],
        paging: this.links || [],
        count: this.charactersCount
      }
    };
  }

  sendMessage(): void {
    const msg = this.prepareMessage();
    this.messageService.sendMessage(msg);
}

  clearMessages(): void {
      this.messageService.clearMessages();
  }
}
