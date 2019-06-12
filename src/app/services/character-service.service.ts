import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Character } from '../models/character';
import { isNull } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  baseJsonUrl = 'http://localhost:3000';
  baseCharactersUrl = this.baseJsonUrl + '/characters';
  baseSpeciesUrl = this.baseJsonUrl + '/species';
  // currPage;
  // query;
  params = {
    page: null,
    search: '',
    sorting: {sort: null, order: null}
  };

  constructor(private http: HttpClient) { }

  prepareParams() {
    let url = this.baseCharactersUrl;
    const urlParams = [];
    if (this.params.page) {
      urlParams.push('_page=' + this.params.page);
    } else {
      urlParams.push('_page=1');
    }
    if (this.params.search) {
      urlParams.push('q=' + this.params.search);
    }
    if (this.params.sorting.sort && this.params.sorting.sort.length > 0) {
      urlParams.push('_sort=' + this.params.sorting.sort);
      urlParams.push('_order=' + this.params.sorting.order);
    }
    if (urlParams.length > 0) {
      url += '?' + urlParams.join('&');
    }
    return url;
  }

  searchCharacter(searchFilter?: any) {
    this.params.search = searchFilter;
  }

  getPage(pageNo: string) {
    this.params.page = pageNo;
  }

  setSort(sort: Object) {
    const sorts = [];
    const orders = [];
    Object.keys(sort).forEach(key => {
      if (sort[key] !== 'none') {
        sorts.push(key);
        orders.push(sort[key]);
      }
    });
    if (sorts.length > 0 && orders.length > 0) {
      this.params.sorting.sort = sorts.join(',');
      this.params.sorting.order = orders.join(',');
    } else {
      this.params.sorting = {sort: null, order: null};
    }
  }

  getCharacters() {
    return this.http.get(this.prepareParams(), {observe: 'response'});
  }

  getCharacter(id: string) {
    return this.http.get(this.baseCharactersUrl + '/' + id);
  }

  createCharacter(character: Character) {
    return this.http.post(this.baseCharactersUrl + '/', character);
  }

  updateCharacter(character: Character, id) {
    return this.http.put(this.baseCharactersUrl + '/' + id, character);
  }

  deleteCharacter(id: number) {
    return this.http.delete(this.baseCharactersUrl + '/' + id);
  }

  getSpecies() {
    return this.http.get(this.baseSpeciesUrl);
  }
}
