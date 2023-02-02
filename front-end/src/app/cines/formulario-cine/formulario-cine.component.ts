import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coordenada } from 'src/app/utilidades/mapa/coordenada';
import { cineCreacionDTO, cineDTO } from '../cine';

@Component({
  selector: 'app-formulario-cine',
  templateUrl: './formulario-cine.component.html',
  styleUrls: ['./formulario-cine.component.css'],
})
export class FormularioCineComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  form: FormGroup;

  @Input() errores:string[] = [];
  @Input() modelo: cineDTO;
  @Output() guardarCambios: EventEmitter<cineCreacionDTO> =
    new EventEmitter<cineCreacionDTO>();

    coordenadaInicial:Coordenada[] = [];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: [
        '',
        {
          validators: [Validators.required],
        },
      ],
      latitud: [
        '',
        {
          validators: [Validators.required],
        },
      ],
      longitud: [
        '',
        {
          validators: [Validators.required],
        },
      ],
    });

    if (this.modelo) {
      this.form.patchValue(this.modelo);
      this.coordenadaInicial.push({latitud:this.modelo.latitud, longitud:this.modelo.longitud});
    }
  }

  onSubmit() {
    this.guardarCambios.emit(this.form.value);
  }

  onCoordenadaSeleccionada(coordenada: Coordenada) {
    this.form.patchValue(coordenada);
  }
}
