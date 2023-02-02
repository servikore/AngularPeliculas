import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { cineDTO } from '../cine';
import { CinesService } from '../cines.service';

@Component({
  selector: 'app-indice-cines',
  templateUrl: './indice-cines.component.html',
  styleUrls: ['./indice-cines.component.css']
})
export class IndiceCinesComponent implements OnInit {

  constructor(private cineService:CinesService) { }

  cines:cineDTO[];
  columnasAmostrar = ['id','nombre','acciones'];
  cantidadTotalRegistros;
  paginaActual:number = 1;
  cantidadRegistrosAMostrar:number = 10;

  ngOnInit(): void {
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina:number, cantidataElementosAMostrar:number){
    this.cineService.obtenerTodos(pagina,cantidataElementosAMostrar)
      .subscribe({
        next: (respuesta:HttpResponse<cineDTO[]>) =>  {
          this.cines = respuesta.body;
          this.cantidadTotalRegistros = respuesta.headers.get('cantidadTotalRegistros');
        },
        error: err => {
          console.log(err)
        }
    });
  }

  actualizarPaginacion(datos:PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual,this.cantidadRegistrosAMostrar);
  }

  borrar(id:number){
    this.cineService.borrar(id).subscribe({
      next:()=> {
        this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
      },
      error: (err)=> {
        console.error(err);
      }
    });
  }


}
