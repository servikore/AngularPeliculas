import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { actorPeliculaDTO } from 'src/app/actores/crear-actor/actor';
import { MultipleSelectorModel } from 'src/app/utilidades/selector-multiple/MultipleSelectorModel';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { PeliculaCreacionDTO, PeliculaDTO } from '../pelicula';
import { PeliculasService } from '../peliculas.service';

@Component({
  selector: 'app-editar-pelicula',
  templateUrl: './editar-pelicula.component.html',
  styleUrls: ['./editar-pelicula.component.css']
})
export class EditarPeliculaComponent implements OnInit {

  constructor(private peliculasService:PeliculasService,
    private activatedRoute:ActivatedRoute,
    private router:Router) { }

  modelo:PeliculaDTO;
  generosSeleccionados:MultipleSelectorModel[] = [];
  generosNoSeleccionados:MultipleSelectorModel[] = [];

  cinesSeleccionados:MultipleSelectorModel[] = [];
  cinesNoSeleccionados:MultipleSelectorModel[] = [];

  actoresSeleccionados:actorPeliculaDTO[] = [];

  errores:string[] = [];

  ngOnInit(): void
  {
    this.activatedRoute.params.subscribe({
      next:(params) => {
          this.peliculasService.putGet(params.id).subscribe({
            next:(peliculaPutGet) => {
                this.modelo = peliculaPutGet.pelicula;

                this.generosNoSeleccionados = peliculaPutGet.generosNoSeleccionados.map(genero => {
                  return <MultipleSelectorModel>{llave:genero.id, valor:genero.nombre}
                });
                this.generosSeleccionados = peliculaPutGet.generosSeleccionados.map(genero => {
                  return <MultipleSelectorModel>{llave:genero.id, valor:genero.nombre}
                });

                this.cinesNoSeleccionados = peliculaPutGet.cinesNoSeleccionados.map(cine => {
                  return <MultipleSelectorModel>{llave:cine.id, valor:cine.nombre}
                });
                this.cinesSeleccionados = peliculaPutGet.cinesSeleccionados.map(cine => {
                  return <MultipleSelectorModel>{llave:cine.id, valor:cine.nombre}
                });

                this.actoresSeleccionados = peliculaPutGet.actores;
            },
            error:(err) => this.errores = parsearErroresAPI(err)
          });
      },
      error:(err)=> this.errores = parsearErroresAPI(err)
    });
  }

  guardarCambios(pelicula:PeliculaCreacionDTO){
    this.peliculasService.editar(this.modelo.id, pelicula).subscribe({
      next:()=> this.router.navigate(['/pelicula/'+this.modelo.id]),
      error:(err) => this.errores = parsearErroresAPI(err)

    });
  }

}
