import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { actorCreacionDTO, actorDTO } from '../crear-actor/actor';

@Component({
  selector: 'app-formulario-actores',
  templateUrl: './formulario-actores.component.html',
  styleUrls: ['./formulario-actores.component.css'],
})
export class FormularioActoresComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  form: FormGroup;

  @Input() modelo:actorDTO;
  @Output() Onsubmit: EventEmitter<actorCreacionDTO> =
    new EventEmitter<actorCreacionDTO>();

  @Input() errores:string[] = [];
  imagenCambiada:boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: [
        '',
        {
          validators: [Validators.required],
        },
      ],
      fechaNacimiento: '',
      foto:'',
      biografia:''
    });

    if(this.modelo){
      this.form.patchValue(this.modelo);
    }
  }

  onSubmit() {

    if(!this.imagenCambiada)
    {
      this.form.patchValue({'foto':null});
    }

    this.Onsubmit.emit(this.form.value);
  }

  archivoSeleccionado(file:File){
    this.imagenCambiada = true;
    this.form.get('foto').setValue(file);
  }
  cambioMarkDown(texto:string){
    this.form.get('biografia').setValue(texto);
  }
}
