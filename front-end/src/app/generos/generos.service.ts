import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { generoCreacionDTO, generoDTO } from './genero';

@Injectable({
  providedIn: 'root'
})
export class GenerosService {

  constructor(private http:HttpClient) { }

  private apiURL = `${environment.apiURL}/generos`;

  public obtenerPaginado(pagina:number, cantidadRegistrosAMostrar:number): Observable<any>{

    let parametros = new HttpParams();
    parametros = parametros.append('Pagina',pagina.toString());
    parametros = parametros.append('RecordsPorPagina',cantidadRegistrosAMostrar.toString());

    return this.http.get<generoDTO[]>(this.apiURL,{
      observe:'response',
      params: parametros
    });
  }

  public obtenerTodos():Observable<generoDTO[]>{
    return this.http.get<generoDTO[]>(`${this.apiURL}/todos`);
  }

  public obtenerPorId(id:number):Observable<generoDTO>{
    return this.http.get<generoDTO>(`${this.apiURL}/${id}`);
  }

  public crear (genero:generoCreacionDTO): Observable<generoCreacionDTO>{
    return this.http.post<generoCreacionDTO>(this.apiURL,genero);
  }

  public editar(id:number, genero:generoCreacionDTO){
    return this.http.put(`${this.apiURL}/${id}`,genero);
  }

  public borrar(id:number){
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
