import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { ActoresService } from '../actores.service';
import { actorDTO, actorCreacionDTO } from '../crear-actor/actor';

@Component({
  selector: 'app-editar-actor',
  templateUrl: './editar-actor.component.html',
  styleUrls: ['./editar-actor.component.css'],
})
export class EditarActorComponent implements OnInit {

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private actoresService:ActoresService
    ) { }

    actor:actorDTO;
    errores:string[] = [];

    ngOnInit(): void {
      this.activatedRoute.params.subscribe({
        next:params => {
          this.actoresService.obtenerPorId(params.id).subscribe({
            next:actorDTO => {
              this.actor = actorDTO;
            },
            error:() =>
            {
              this.router.navigate(['/actores'])
            }
          });
        }
      })
  }

  guardarCambios(actorDTO:actorCreacionDTO){
    this.actoresService.editar(this.actor.id,actorDTO).subscribe({
      next:()=>{
        this.router.navigate(['/actores']);
      },
      error: err => {
        this.errores = parsearErroresAPI(err);
      }
    });
  }
}
