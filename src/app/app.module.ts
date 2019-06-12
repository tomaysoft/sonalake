import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { CharactersTableComponent } from './components/characters-table/characters-table.component';
import { EditComponent } from './components/edit/edit.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    ListViewComponent,
    PaginatorComponent,
    SearchFieldComponent,
    CharactersTableComponent,
    EditComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
