import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { generoDTO } from '../genero';
import { GenerosService } from '../generos.service';

@Component({
  selector: 'app-indice-generos',
  templateUrl: './indice-generos.component.html',
  styleUrls: ['./indice-generos.component.css']
})
export class IndiceGenerosComponent implements OnInit {

  constructor(private generoService:GenerosService) { }

  generos:generoDTO[];
  columnasAmostrar = ['id','nombre','acciones'];
  cantidadTotalRegistros;
  paginaActual:number = 1;
  cantidadRegistrosAMostrar:number = 10;

  ngOnInit(): void {
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina:number, cantidataElementosAMostrar:number){
    this.generoService.obtenerPaginado(pagina,cantidataElementosAMostrar)
      .subscribe({
        next: (respuesta:HttpResponse<generoDTO[]>) =>  {
          this.generos = respuesta.body;
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
    this.generoService.borrar(id).subscribe({
      next:()=> {
        this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
      },
      error: (err)=> {
        console.error(err);
      }
    });
  }

}
