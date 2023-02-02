import { Component, OnInit } from '@angular/core';
import { PeliculaDTO } from '../peliculas/pelicula';
import { PeliculasService } from '../peliculas/peliculas.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private peliculasService:PeliculasService) { }

  peliculasEnCines:PeliculaDTO[];
  peliculasProximosExtrenos:PeliculaDTO[];

  ngOnInit(): void {
    this.cargarDatos();
  }

 private cargarDatos(){
    this.peliculasService.obtenerLandingPage().subscribe({
      next:(dto) => {
        this.peliculasEnCines = dto.enCines;
        this.peliculasProximosExtrenos = dto.proximosEstrenos;
      },
      error:(err) => console.log(err)
    });
  }

  manejarRated(voto:number):void{
    alert(voto);
  }

  borrado(){
    this.cargarDatos();
  }

}
