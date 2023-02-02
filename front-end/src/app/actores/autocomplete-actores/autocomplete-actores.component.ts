import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { ActoresService } from '../actores.service';
import { actorPeliculaDTO } from '../crear-actor/actor';

@Component({
  selector: 'app-autocomplete-actores',
  templateUrl: './autocomplete-actores.component.html',
  styleUrls: ['./autocomplete-actores.component.css'],
})
export class AutocompleteActoresComponent implements OnInit {
  constructor(private actoresService: ActoresService) {}

  control: FormControl = new FormControl();

  @Input() actoresSeleccionados: actorPeliculaDTO[] = [];
  actoresAMostrar: actorPeliculaDTO[] = [];

  columnasAMostrar: string[] = ['imagen', 'nombre', 'personaje', 'acciones'];

  @ViewChild(MatTable) table: MatTable<any>;

  ngOnInit(): void {
    this.control.valueChanges.subscribe((nombre) => {
      if (typeof nombre === 'string' && nombre) {
        this.actoresService.obtenerPorNombre(nombre).subscribe({
          next: (actores) => {
            this.actoresAMostrar = actores;
          },
        });
      }
    });
  }

  OnoptionSelected(event: MatAutocompleteSelectedEvent) {
    this.actoresSeleccionados.push(event.option.value);
    this.control.patchValue('');
    if (this.table) {
      this.table.renderRows();
    }
  }

  eliminar(actor: any) {
    const indice = this.actoresSeleccionados.findIndex(
      (a) => a.nombre === actor.nombre
    );
    this.actoresSeleccionados.splice(indice, 1);
    this.table.renderRows();
  }

  finalizarArrastre(event: CdkDragDrop<any[]>) {
    const indicePrevio = this.actoresSeleccionados.findIndex(
      (a) => a === event.item.data
    );
    moveItemInArray(
      this.actoresSeleccionados,
      indicePrevio,
      event.currentIndex
    );
    this.table.renderRows();
  }
}
