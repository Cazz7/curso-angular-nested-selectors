import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders : SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
   ){}

  ngOnInit(): void {
    // Se ejecuta cuando se inicializa el componente
    // En este caso tambine sirve cuando hay cambios de valores
    // El ngOnInit no debe tener mucho codigo
    this.onRegionChanged();
    this.onCountryChanged();
  }

   get regions(): Region[]{
    return this.countriesService.regions;
   }

   public onRegionChanged():void{
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap( () => {
        if(this.myForm.get('country')!.value){
          (this.myForm.get('country')!.setValue(''))
        }
      }), // Cuando se cambia el valor se establece por defecto un valro vacio
      tap( () => this.borders = [] ),
      switchMap( (region) => this.countriesService.getCountriesByRegion(region) )
      // Cuando tengo un argumento que lo mando como argumento en el llamado de otra funcion
      // como aqui que region se envia en el llamado a la funcion.
      // Entonces lo puedo simplificar asi
      // Pues no me funciono
      //switchMap( this.countriesService.getCountriesByRegion )
    )
    .subscribe( countries => {
      this.countriesByRegion = countries;
    } );
   }

   public onCountryChanged():void{
    this.myForm.get('country')!.valueChanges
    .pipe(
       // Cuando se cambia el valor se establece por defecto un valro vacio
      filter( (value: string) => value.length > 0 ), // Si no se cumple verdadero entocnes no continua
      tap( () => {
        if(this.myForm.get('borders')!.value){
          (this.myForm.get('borders')!.setValue(''))
        }
      }),
      // tambien funciona sin parentesis en alphacode
      switchMap( (alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode) ),
      switchMap( (country) => this.countriesService.getCountryBordersByCodes( country.borders ) )
    )
    .subscribe( countries => {
      this.borders = countries;
    } );
   }

}
