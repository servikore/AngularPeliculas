import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { cineCreacionDTO, cineDTO } from './cine';

@Injectable({
  providedIn: 'root'
})
export class CinesService {

  constructor(private http:HttpClient) { }

  private apiURL = `${environment.apiURL}/cines`;

  public obtenerTodos(pagina:number, cantidadRegistrosAMostrar:number): Observable<any>{

    let parametros = new HttpParams();
    parametros = parametros.append('Pagina',pagina.toString());
    parametros = parametros.append('RecordsPorPagina',cantidadRegistrosAMostrar.toString());

    return this.http.get<cineDTO[]>(this.apiURL,{
      observe:'response',
      params: parametros
    });
  }

  public obtenerPorId(id:number):Observable<cineDTO>{
    return this.http.get<cineDTO>(`${this.apiURL}/${id}`);
  }

  public crear (genero:cineCreacionDTO){
    return this.http.post(this.apiURL,genero);
  }

  public editar(id:number, genero:cineCreacionDTO){
    return this.http.put(`${this.apiURL}/${id}`,genero);
  }

  public borrar(id:number){
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
