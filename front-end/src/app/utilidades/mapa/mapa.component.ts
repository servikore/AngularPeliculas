import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  tileLayer,
  latLng,
  LeafletMouseEvent,
  Marker,
  marker,
  icon,
} from 'leaflet';
import { Coordenada, CoordenadaConMensaje } from './coordenada';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit {
  constructor() {}

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 14,
    center: latLng(18.47957852896943, -69.9272918701172),
  };

  capas: Marker<any>[] = [];

  @Output() coordenadaSeleccionada: EventEmitter<Coordenada> =
    new EventEmitter<Coordenada>();
  @Input() coordenadasIniciales: CoordenadaConMensaje[] = [];
  @Input() soloLectura: boolean = false;

  ngOnInit(): void {
    Marker.prototype.options.icon = icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'marker-icon.png',
      iconRetinaUrl: 'marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
    });

    this.capas = this.coordenadasIniciales.map((coor) => {
      let marcador = marker([coor.latitud, coor.longitud]);
      if (coor.mensaje) {
        marcador.bindPopup(coor.mensaje, { autoClose: false, autoPan: false });
      }
      return marcador;
    });

    if (this.coordenadasIniciales.length > 0) {
      this.options.center = latLng(
        this.coordenadasIniciales[0].latitud,
        this.coordenadasIniciales[0].longitud
      );
      this.options.zoom = 18;
    }
  }

  manejarClick(event: LeafletMouseEvent) {
    if (!this.soloLectura) {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;

      this.capas = [];
      this.capas.push(marker([lat, lng]));

      this.coordenadaSeleccionada.emit({ latitud: lat, longitud: lng });
    }
  }
}
