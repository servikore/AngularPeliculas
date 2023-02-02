import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { generoCreacionDTO } from '../genero';
import { GenerosService } from '../generos.service';

@Component({
  selector: 'app-crear-genero',
  templateUrl: './crear-genero.component.html',
  styleUrls: ['./crear-genero.component.css']
})
export class CrearGeneroComponent implements OnInit {

  constructor(private router:Router, private generosService:GenerosService) { }

  errores:string[] = [];

  ngOnInit(): void {

  }

  guardarCambios(genero:generoCreacionDTO):void{
    this.generosService.crear(genero).subscribe({
     next: gneroCreado => {
      this.router.navigate(['/generos']);
    },
    error: error => this.errores = parsearErroresAPI(error)
  });
  }
}
