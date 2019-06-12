import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CharacterService } from 'src/app/services/character-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from 'src/app/models/character';

@Component({
  selector: 'sl-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  characterForm: any;
  character: Character;
  id;
  genderDict = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
    {value: 'n/a', label: 'n/a'}
  ];
  speciesDict;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder,
              private characterService: CharacterService,
              private route: ActivatedRoute,
              private router: Router) {
    this.characterForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'species': [null, Validators.required],
      'gender': [null, Validators.required],
      'homeworld': ''
    });
    this.characterService.getSpecies().subscribe((response) => {
      this.speciesDict = response;
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    if (this.id) {
      this.characterService.getCharacter(this.id).subscribe(character => {
        this.characterForm.patchValue({
          name: character['name'],
          species: character['species'],
          gender: character['gender'],
          homeworld: character['homeworld']
        });

      });
    }
  }

  onSubmit() {
    const character = <Character>this.characterForm.value;
    this.isSubmitted = true;
    if (this.characterForm.invalid) {
      return;
    }
    if (this.id) {
      this.characterService.updateCharacter(character, this.id).subscribe(response => {
        if (!response['error']) {
          this.router.navigate(['']);
        }

      });
    } else {
      this.characterService.createCharacter(character).subscribe(response => {
        if (!response['error']) {
          this.router.navigate(['']);
        }
      });
    }
  }
}
