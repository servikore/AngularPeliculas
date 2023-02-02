using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PeliculasAPI.Controllers;

[Route("api/actores")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,Policy ="EsAdmin")]
public class ActoresController : ControllerBase
{
    private readonly ApplicationDbContext context;
    private readonly IMapper mapper;
    private readonly IAlmacenadorArchivos almacenadorArchivos;
    private const string contenedor = "actores";

    public ActoresController(ApplicationDbContext context, 
        IMapper mapper, IAlmacenadorArchivos almacenadorArchivos)
    {
        this.context = context;
        this.mapper = mapper;
        this.almacenadorArchivos = almacenadorArchivos;
    }

    // GET: api/<ActoresController>
    [HttpGet]
    public async Task<ActionResult<List<ActorDTO>>> Get([FromQuery] PaginacionDTO paginacionDTO)
    {
        var queryable = context.Actores.AsQueryable();
        await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
        
        var actores = await queryable.OrderBy(a => a.Nombre)
            .Paginar(paginacionDTO).AsNoTracking().ToListAsync();

        return mapper.Map<List<ActorDTO>>(actores);
    }

    // GET api/<ActoresController>/5
    [HttpGet("{Id:int}")]
    public async Task<ActionResult<ActorDTO>> Get(int Id)
    {
        var actor = await context.Actores.AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == Id);

        if (actor == null) return NotFound();

        return mapper.Map<ActorDTO>(actor);
    }

    // POST api/<ActoresController>
    [HttpPost]
    public async Task<ActionResult> Post([FromForm] ActorCreacionDTO actorCreacionDTO)
    {
        var actor = mapper.Map<Actor>(actorCreacionDTO);

        if(actorCreacionDTO.Foto != null)
        {
            actor.Foto = await almacenadorArchivos.GuardarArchivo(contenedor, actorCreacionDTO.Foto);
        }

        context.Add(actor);
        await context.SaveChangesAsync();
        return Created("", actor);
    }

    [HttpPost("buscarPorNombre")]
    public async Task<ActionResult<List<PeliculaActorDTO>>> BuscarPorNombre([FromBody]string nombre)
    {
        if (string.IsNullOrEmpty(nombre)) return new List<PeliculaActorDTO>();

        return await context.Actores
            .Where(a => a.Nombre.Contains(nombre))
            .Select(a => new PeliculaActorDTO { Id = a.Id, Nombre = a.Nombre, Foto = a.Foto })
            .Take(5)
            .AsNoTracking()
            .ToListAsync();
    }

    // PUT api/<ActoresContro
    // ller>/5
    [HttpPut("{Id:Int}")]
    public async Task<ActionResult> Put(int Id, [FromForm] ActorCreacionDTO actorCreacionDTO)
    {
        var actor = await context.Actores.FirstOrDefaultAsync(a => a.Id == Id);

        if (actor == null) return NotFound();

        if(actorCreacionDTO.Foto != null)
        {
            actor.Foto = await almacenadorArchivos.EditarArchivo(contenedor, actorCreacionDTO.Foto, actor.Foto);
        }

        mapper.Map(actorCreacionDTO, actor);

        await context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE api/<ActoresController>/5
    [HttpDelete("{Id:Int}")]
    public async Task<ActionResult> Delete(int Id)
    {
        var actor = await context.Actores.FirstOrDefaultAsync(g => g.Id == Id);

        if (actor == null) return NotFound();

        context.Remove(actor);
        await context.SaveChangesAsync();

        if (!string.IsNullOrEmpty(actor.Foto))
            await almacenadorArchivos.BorrarArchivo(actor.Foto, contenedor);

        return NoContent();
    }
}

