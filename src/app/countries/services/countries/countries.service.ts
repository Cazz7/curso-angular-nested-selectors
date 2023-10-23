import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country, Region, SmallCountry } from '../../interfaces/country.interfaces';
import { Observable, combineLatest, filter, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';
  private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania ]

  constructor(
    private http: HttpClient
  ) { }

  get regions(): Region[]{

    // Para no mandar la referncia sino un valor independiente
    return [ ...this._regions ];

  }

  getCountriesByRegion( region: Region ): Observable<SmallCountry[]>{
    if( !region ) return of([]);

    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url)
    .pipe(
      // Tener en cuenta que es diferente el operador map de rxjx
      // al operador
      map( countries => countries.map( country => ( {
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? [] // operador de covalencia nula
      } ) )),
      map( sortedCountries => sortedCountries.sort((a, b) => a.name.localeCompare(b.name)) )
      //,
      //tap( response => console.log({ response }) )// Efectos secundarios
    )
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry>{

    const url = `${ this.baseUrl }/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>( url )
      .pipe(
        map( country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? [] // operador de covalencia nula
        }))
      )
  }

  getCountryBordersByCodes( borders: string[] ): Observable<SmallCountry[]>{

    if( !borders || borders.length === 0 ) return of([]);

    let countriesRequestsInfo: Observable<SmallCountry>[] = [];

    // Esta lista de observable todavia no se ha instalado
    borders.forEach( code => {
      const request = this.getCountryByAlphaCode( code );
      countriesRequestsInfo.push( request );
    } );

    // Va a emitir hasta que todos los observable emitan un valor
    return combineLatest( countriesRequestsInfo );
  }
}
