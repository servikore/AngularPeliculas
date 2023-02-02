import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MultipleSelectorModel } from 'src/app/utilidades/selector-multiple/MultipleSelectorModel';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { PeliculaCreacionDTO } from '../pelicula';
import { PeliculasService } from '../peliculas.service';

@Component({
  selector: 'app-crear-pelicula',
  templateUrl: './crear-pelicula.component.html',
  styleUrls: ['./crear-pelicula.component.css']
})
export class CrearPeliculaComponent implements OnInit {

  constructor(private peliculasService:PeliculasService,
    private router:Router) { }

  errores:string[] = [];
  generosNoSeleccionados:MultipleSelectorModel[];
  cinesNoSeleccionados:MultipleSelectorModel[];

  ngOnInit(): void {
    this.peliculasService.postget().subscribe({
      next:(peliculaPostGet) => {
        this.generosNoSeleccionados = peliculaPostGet.generos.map(genero => {
          return <MultipleSelectorModel>{llave:genero.id, valor:genero.nombre}
        });

        this.cinesNoSeleccionados = peliculaPostGet.cines.map(cine => {
          return <MultipleSelectorModel>{llave:cine.id, valor:cine.nombre}
        });
      },
      error: (err) => console.log(err)
    });
  }

  guardarCambios(pelicula:PeliculaCreacionDTO){
    this.peliculasService.crear(pelicula).subscribe({
      next:(id)=> this.router.navigate(['/pelicula/'+ id]),
      error: (err) => this.errores = parsearErroresAPI(err)
    });
  }

}
