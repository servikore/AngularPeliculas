using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;
using System.Net.NetworkInformation;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PeliculasAPI.Controllers
{
    [Route("api/peliculas")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "EsAdmin")]
    public class PeliculasController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IAlmacenadorArchivos almacenadorArchivos;
        private readonly UserManager<IdentityUser> userManager;
        private const string contenedor = "peliculas";

        public PeliculasController(ApplicationDbContext context, 
            IMapper mapper, 
            IAlmacenadorArchivos almacenadorArchivos,
            UserManager<IdentityUser> userManager)
        {
            this.context = context;
            this.mapper = mapper;
            this.almacenadorArchivos = almacenadorArchivos;
            this.userManager = userManager;
        }
        // GET: api/<PeliculasController>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<LandingPageDTO>> Get()
        {
            const int top = 6;
            var hoy = DateTime.Today;

            var proximosEstrenos = await context.Peliculas
                .Where(p => p.FechaLanzamiento > hoy)
                .OrderBy(p => p.FechaLanzamiento)
                .Take(top)
                .ToListAsync();

            var enCines = await context.Peliculas
                .Where(p => p.EnCines)
                .OrderBy(p => p.FechaLanzamiento)
                .Take(top)
                .ToListAsync();

            var resultado = new LandingPageDTO();
            resultado.ProximosEstrenos = mapper.Map<List<PeliculaDTO>>(proximosEstrenos);
            resultado.EnCines = mapper.Map<List<PeliculaDTO>>(enCines);

            return resultado;
        }

        // GET api/<PeliculasController>/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<PeliculaDTO>> Get(int id)
        {
            var pelicula = await context.Peliculas.AsNoTracking()
                .Include(p => p.PeliculasGeneros).ThenInclude(pg => pg.Genero)
                .Include(p => p.PeliculasActores).ThenInclude(pa => pa.Actor)
                .Include(p => p.PeliculasCines).ThenInclude(pc => pc.Cine)                
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if(pelicula == null)return NotFound();

            var promedioVoto = 0.0;
            var usuarioVoto = 0;

            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var email = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "email").Value;
                var usuario = await userManager.FindByEmailAsync(email);

                var ratingDB = await context.Ratins.AsNoTracking()
                    .FirstOrDefaultAsync(r => r.PeliculaId == id
                    && r.UsuarioId == usuario.Id);

                usuarioVoto = ratingDB?.Puntuacion ?? 0;
            }

            promedioVoto = await context.Ratins
                .Where(r => r.PeliculaId == id)                
                .AverageAsync(p => (int?)p.Puntuacion) ?? 0.0;
            

            var dto = mapper.Map<PeliculaDTO>(pelicula);
            dto.Actores = dto.Actores.OrderBy(a => a.Orden).ToList();
            dto.PromedioVoto = promedioVoto;
            dto.VotoUsuario = usuarioVoto;

            return dto;
        }

        [HttpGet("Filtrar")]
        [AllowAnonymous]
        public async Task<ActionResult<List<PeliculaDTO>>> Filtrar([FromQuery] PeliculasFiltrarDTO peliculasFiltrarDTO)
        {
            var peliculasQueriable = context.Peliculas.AsQueryable();

            if (!string.IsNullOrEmpty(peliculasFiltrarDTO.Titulo))
            {
                peliculasQueriable = peliculasQueriable.Where(p => p.Titulo.Contains(peliculasFiltrarDTO.Titulo));
            }

            if (peliculasFiltrarDTO.EnCines)
            {
                peliculasQueriable = peliculasQueriable.Where(p => p.EnCines);
            }

            if (peliculasFiltrarDTO.ProximosEstrenos)
            {
                var hoy = DateTime.Today;
                peliculasQueriable = peliculasQueriable.Where(p => p.FechaLanzamiento > hoy);
            }

            if(peliculasFiltrarDTO.GeneroId != 0)
            {
                peliculasQueriable = peliculasQueriable
                    .Where(p => p.PeliculasGeneros.Select(pg => pg.GeneroId)
                    .Contains(peliculasFiltrarDTO.GeneroId));
            }

            await HttpContext.InsertarParametrosPaginacionEnCabecera(peliculasQueriable);

            var peliculas = await peliculasQueriable
                .Paginar(peliculasFiltrarDTO.PaginacionDTO)
                .ToListAsync();

            return mapper.Map<List<PeliculaDTO>>(peliculas);

        }

        [HttpGet("PostGet")]
        public async Task<ActionResult<PeliculasPostGetDTO>> PostGet()
        {
            var cines = await context.Cines.AsNoTracking().ToListAsync();
            var generos = await context.Generos.AsNoTracking().ToListAsync();

            var cinesDTO = mapper.Map<List<CineDTO>>(cines);
            var generosDTO = mapper.Map<List<GeneroDTO>>(generos);

            return new PeliculasPostGetDTO { Cines = cinesDTO, Generos = generosDTO };
        }

        [HttpGet("PutGet/{id:int}")]
        public async Task<ActionResult<PeliculasPutGetDTO>> PutGet(int id)
        {
            var peliculaActionResult = await Get(id);
            if (peliculaActionResult.Result is NotFoundResult) return NotFound();

            var pelicula = peliculaActionResult.Value;

            var generosSeleccionadosIds = pelicula.Generos.Select(g => g.Id).ToList();
            var generosNoSeleccionados = await context.Generos
                .Where(g => !generosSeleccionadosIds.Contains(g.Id)).ToListAsync();

            var cinesSeleccionadosIds = pelicula.Cines.Select(c => c.Id).ToList();
            var cinesNoSeleccionados = await context.Cines
                .Where(c => !cinesSeleccionadosIds.Contains(c.Id)).ToListAsync();

            var generosNoSeleccionadosDTO = mapper.Map<List<GeneroDTO>>(generosNoSeleccionados);
            var cinesNoSeleccionadosDTO = mapper.Map<List<CineDTO>>(cinesNoSeleccionados);

            return new PeliculasPutGetDTO
            {
                Pelicula = pelicula,
                GenerosSeleccionados = pelicula.Generos,
                GenerosNoSeleccionados = generosNoSeleccionadosDTO,
                CinesSeleccionados = pelicula.Cines,
                CinesNoSeleccionados = cinesNoSeleccionadosDTO,
                Actores = pelicula.Actores
            };
        }

        // POST api/<PeliculasController>
        [HttpPost]
        public async Task<ActionResult<int>> Post([FromForm] PeliculaCreacionDTO peliculaCreacionDTO)
        {
            var pelicula = mapper.Map<Pelicula>(peliculaCreacionDTO);
            if (peliculaCreacionDTO.Poster != null)
            {
                pelicula.Poster = await almacenadorArchivos.GuardarArchivo(contenedor, peliculaCreacionDTO.Poster);
            }

            EscribirOrdenActores(pelicula);

            context.Add(pelicula);
            await context.SaveChangesAsync();

            return pelicula.Id;
        }

        private void EscribirOrdenActores(Pelicula pelicula)
        {
            if(pelicula.PeliculasActores != null)
            {
                for (int i = 0; i < pelicula.PeliculasActores.Count; i++)
                {
                    pelicula.PeliculasActores[i].Orden = i;
                }
            }
        }

        // PUT api/<PeliculasController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromForm] PeliculaCreacionDTO peliculaCreacionDTO)
        {
            var pelicula = await context.Peliculas
                .Include(p => p.PeliculasActores)
                .Include(p => p.PeliculasGeneros)
                .Include(p => p.PeliculasCines)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pelicula == null) return NotFound();

            pelicula = mapper.Map(peliculaCreacionDTO,pelicula);

            if(peliculaCreacionDTO.Poster != null)
            {
                pelicula.Poster = await almacenadorArchivos
                    .EditarArchivo(contenedor,peliculaCreacionDTO.Poster,pelicula.Poster);
            }

            EscribirOrdenActores(pelicula);
            await context.SaveChangesAsync();
            return NoContent();

        }

        // DELETE api/<PeliculasController>/5
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var pelicula = await context.Peliculas.FirstOrDefaultAsync(p => p.Id == id);

            if(pelicula == null) return NotFound();

            context.Remove(pelicula);
            await context.SaveChangesAsync();

            await almacenadorArchivos.BorrarArchivo(pelicula.Poster,contenedor);

            return NoContent();
        }

    }
}
