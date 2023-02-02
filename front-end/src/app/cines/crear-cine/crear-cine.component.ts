import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { cineCreacionDTO } from '../cine';
import { CinesService } from '../cines.service';

@Component({
  selector: 'app-crear-cine',
  templateUrl: './crear-cine.component.html',
  styleUrls: ['./crear-cine.component.css']
})
export class CrearCineComponent {

  constructor(private router:Router, private cinesService:CinesService) { }

  errores:string[] = [];

  guardarCambios(cine:cineCreacionDTO):void{
    this.cinesService.crear(cine).subscribe({
     next: () => {
      this.router.navigate(['/cines']);
    },
    error: error => this.errores = parsearErroresAPI(error)
  });
  }

}
