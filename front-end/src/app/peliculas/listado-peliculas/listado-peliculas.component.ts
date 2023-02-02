import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeliculaDTO } from '../pelicula';
import { PeliculasService } from '../peliculas.service';

@Component({
  selector: 'app-listado-peliculas',
  templateUrl: './listado-peliculas.component.html',
  styleUrls: ['./listado-peliculas.component.css']
})
export class ListadoPeliculasComponent implements OnInit {

  constructor(private peliculasService:PeliculasService) { }

  @Output() borrado: EventEmitter<void> = new EventEmitter<void>();
  ngOnInit(): void {
  }

  @Input() peliculas:PeliculaDTO[];

  borrar(peliculaId:number):void{
    this.peliculasService.borrar(peliculaId).subscribe({
      next:() => this.borrado.emit()
    });
  }

}
