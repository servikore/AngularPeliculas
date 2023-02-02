import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { ActoresService } from '../actores.service';
import { actorCreacionDTO } from './actor';

@Component({
  selector: 'app-crear-actor',
  templateUrl: './crear-actor.component.html',
  styleUrls: ['./crear-actor.component.css']
})
export class CrearActorComponent implements OnInit {

  constructor(private actoresService:ActoresService,
    private router:Router ) { }

    errores:string[] = [];

  ngOnInit(): void {
  }

  guardarCambios(actor:actorCreacionDTO){
    this.actoresService.crear(actor).subscribe({
      next:(actorSaved) => {
        this.router.navigate(['/actores']);
      },
      error:(err)=>{
        this.errores = parsearErroresAPI(err);
      }
    });
  }
}
