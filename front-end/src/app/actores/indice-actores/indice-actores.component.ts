import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActoresService } from '../actores.service';
import { actorDTO } from '../crear-actor/actor';

@Component({
  selector: 'app-indice-actores',
  templateUrl: './indice-actores.component.html',
  styleUrls: ['./indice-actores.component.css']
})
export class IndiceActoresComponent implements OnInit {

  constructor(private actoresService:ActoresService) { }

  actores:actorDTO[];
  columnasAmostrar = ['id','nombre','acciones'];
  cantidadTotalRegistros;
  paginaActual:number = 1;
  cantidadRegistrosAMostrar:number = 10;

  ngOnInit(): void {
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina:number, cantidataElementosAMostrar:number){
    this.actoresService.obtenerTodos(pagina,cantidataElementosAMostrar)
      .subscribe({
        next: (respuesta:HttpResponse<actorDTO[]>) =>  {
          this.actores = respuesta.body;
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
    this.actoresService.borrar(id).subscribe({
      next:()=> {
        this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
      },
      error: (err)=> {
        console.error(err);
      }
    });
  }


}
