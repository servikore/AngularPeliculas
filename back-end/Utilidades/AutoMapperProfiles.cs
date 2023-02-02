
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NetTopologySuite.Geometries;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using System.ComponentModel.Design;

namespace PeliculasAPI.Utilidades;

public class AutoMapperProfiles: Profile
{
    public AutoMapperProfiles(GeometryFactory geometryFactory)
    {
        CreateMap<Genero,GeneroDTO>().ReverseMap();
        CreateMap<GeneroCreacionDTO,Genero>();

        CreateMap<Actor, ActorDTO>().ReverseMap();
        CreateMap<ActorCreacionDTO, Actor>()
            .ForMember(x => x.Foto, options => options.Ignore());

        CreateMap<Cine, CineDTO>()
            .ForMember(dto => dto.Latitud, opt => opt.MapFrom(c => c.Ubicacion.Y))
            .ForMember(dto => dto.Longitud, opt => opt.MapFrom(c => c.Ubicacion.X))
            .ReverseMap()
            .ForMember(c => c.Ubicacion, opt => 
                opt.MapFrom(dto => geometryFactory.CreatePoint(new Coordinate(dto.Longitud,dto.Latitud))));        

        CreateMap<CineCreacionDTO, Cine>()
            .ForMember(c => c.Ubicacion, options => 
                options.MapFrom(dto => geometryFactory.CreatePoint(new Coordinate(dto.Longitud,dto.Latitud))) );

        CreateMap<PeliculaCreacionDTO, Pelicula>()
            .ForMember(p => p.Poster, opt => opt.Ignore())
            .ForMember(p => p.PeliculasGeneros, opt => opt.MapFrom(MapearPeliculasGeneros))
            .ForMember(p => p.PeliculasCines, opt => opt.MapFrom(MapearPeliculasCines))
            .ForMember(p => p.PeliculasActores, opt => opt.MapFrom(MapearPeliculasActores));

        CreateMap<Pelicula, PeliculaDTO>()
            .ForMember(dto => dto.Generos, opt => opt.MapFrom(MapearPeliculasGeneros))
            .ForMember(dto => dto.Actores, opt => opt.MapFrom(MapearPeliculasActores))
            .ForMember(dto => dto.Cines, opt => opt.MapFrom(MapearPeliculasCines));

        CreateMap<IdentityUser, UsuarioDTO>();

    }
    private List<CineDTO> MapearPeliculasCines(Pelicula pelicula, PeliculaDTO peliculaDTO)
    {
        var resultado = new List<CineDTO>();

        if (pelicula.PeliculasActores != null)
        {
            foreach (var cine in pelicula.PeliculasCines)
            {
                resultado.Add(new CineDTO
                {
                    Id = cine.CineId,
                    Nombre = cine.Cine.Nombre,
                    Latitud = cine.Cine.Ubicacion.Y,
                    Longitud = cine.Cine.Ubicacion.X
                });
            }
        }

        return resultado;
    }

    private List<PeliculaActorDTO> MapearPeliculasActores(Pelicula pelicula, PeliculaDTO peliculaDTO)
    {
        var resultado = new List<PeliculaActorDTO>();

        if (pelicula.PeliculasActores != null)
        {
            foreach (var pactor in pelicula.PeliculasActores)
            {
                resultado.Add(new PeliculaActorDTO 
                { 
                    Id = pactor.ActorId,
                    Nombre = pactor.Actor.Nombre,
                    Foto = pactor.Actor.Foto,
                    Orden = pactor.Orden,
                    Personaje = pactor.Personaje
                });
            }
        }

        return resultado;
    }

    private List<GeneroDTO> MapearPeliculasGeneros(Pelicula pelicula, PeliculaDTO peliculaDTO)
    {
        var resultado = new List<GeneroDTO>();

        if(pelicula.PeliculasGeneros != null)
        {
            foreach (var genero in pelicula.PeliculasGeneros)
            {
                resultado.Add(new GeneroDTO { Id = genero.GeneroId, Nombre = genero.Genero.Nombre});
            }
        }

        return resultado;
    }

    private List<PeliculasActores> MapearPeliculasActores(PeliculaCreacionDTO peliculaCreacionDTO,
        Pelicula pelicula)
    {
        var resultados = new List<PeliculasActores>();

        if (peliculaCreacionDTO.Actores == null) return resultados;

        foreach (var actor in peliculaCreacionDTO.Actores)
        {
            resultados.Add(new PeliculasActores { ActorId = actor.Id, Personaje = actor.Personaje });
        }

        return resultados;
    }

    private List<PeliculasGeneros> MapearPeliculasGeneros(PeliculaCreacionDTO peliculaCreacionDTO,
        Pelicula pelicula)
    {
        var resultados = new List<PeliculasGeneros>();

        if (peliculaCreacionDTO.GenerosIds == null) return resultados;

        foreach (var id in peliculaCreacionDTO.GenerosIds)
        {
            resultados.Add(new PeliculasGeneros { GeneroId = id });
        }

        return resultados;
    }

    private List<PeliculasCines> MapearPeliculasCines(PeliculaCreacionDTO peliculaCreacionDTO,
        Pelicula pelicula)
    {
        var resultados = new List<PeliculasCines>();

        if (peliculaCreacionDTO.CinesIds == null) return resultados;

        foreach (var id in peliculaCreacionDTO.CinesIds)
        {
            resultados.Add(new PeliculasCines { CineId = id });
        }

        return resultados;
    }
}
