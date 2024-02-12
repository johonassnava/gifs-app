import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY = 'o9ECHAv97PmR54TTqXleV1EGSeze03og';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = []

  private _tagsHistory: string[] = []
  // private apiKey: string = 'o9ECHAv97PmR54TTqXleV1EGSeze03og'
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

  constructor(private http: HttpClient) {
    // Cargamos los datos cuando montamos el componente
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {

    // Pasamos a minúscula
    tag = tag.toLowerCase();

    // Borramos si hay otro tag igual
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    // Ponemos nuevo tag al comienzo
    this._tagsHistory.unshift(tag);

    // Cortamos el arreglo para que sólo tenga 10 elementos
    this._tagsHistory = this._tagsHistory.splice(0, 10)

    // Guardamos en LocalStorage
    this.saveLocalStorage();

  }

  private saveLocalStorage() {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory))
  }

  // Para recuperar lo salvado en LocalStorage

  private loadLocalStorage(): void {
    // Si no tenemos datos, nos salimos
    if (!localStorage.getItem('history')) return;

    // Parseamos los datos de localStorage que están como string
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!)

    // Hacemos validación de que la longitud del arreglo es mayor que cero, y buscamos tag de primera posición
    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  // Para trabajar con promesas
  // async searchTag(tag: string): Promise<void> {

  searchTag(tag: string): void {

    // No permitir inserciones vacías
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    // Hacemos la petición http con promesas
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=o9ECHAv97PmR54TTqXleV1EGSeze03og&q=valorant&limit=10')
    //   .then( resp => resp.json() )
    //   .then( data => console.log(data) );

    // Hacemos la petición http con await
    // const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=o9ECHAv97PmR54TTqXleV1EGSeze03og&q=valorant&limit=10')
    // const data = await resp.json()
    // console.log(data);

    // Hacemos la petición con HttpClient, ahora es un observable

    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params: params })
      .subscribe(resp => {

        this.gifList = resp.data

        // console.log({ gifs: this.gifList })

      });

  }

}
