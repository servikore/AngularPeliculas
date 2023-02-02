using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;

namespace PeliculasAPI.Controllers
{
    [ApiController]
    [Route("api/generos")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "EsAdmin")]
    public class GenerosController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;

        public GenerosController(ApplicationDbContext context, 
        IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GeneroDTO>>> Get([FromQuery] PaginacionDTO paginacionDTO){
            var queryable = context.Generos.AsQueryable();
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            
            var generos = await queryable.OrderBy(g => g.Nombre)
                .Paginar(paginacionDTO).AsNoTracking().ToListAsync();

            return mapper.Map<List<GeneroDTO>>(generos);
        }

        [HttpGet("todos")]
        [AllowAnonymous]
        public async Task<ActionResult<List<GeneroDTO>>> Todos()
        {
            var generos = await context.Generos.ToListAsync();
            return mapper.Map<List<GeneroDTO>>(generos);
        }

        [HttpGet("{Id:int}")]
        public async Task<ActionResult<GeneroDTO>> Get(int Id)
        {
            var genero = await context.Generos.AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == Id);

            if(genero == null) return NotFound();

            return mapper.Map<GeneroDTO>(genero);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] GeneroCreacionDTO generoCreacionDTO){
            var genero = mapper.Map<Genero>(generoCreacionDTO);
            context.Generos.Add(genero);
            await context.SaveChangesAsync();
            return Created("",genero);
        }

        [HttpPut("{Id:Int}")]
        public async Task<ActionResult> Put(int Id, [FromBody] GeneroCreacionDTO generoCreacionDTO)
        {
            var genero = await context.Generos.FirstOrDefaultAsync(g => g.Id == Id);

            if (genero == null) return NotFound();

            mapper.Map(generoCreacionDTO, genero);

            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{Id:Int}")]
        public async Task<ActionResult> Delete(int Id)
        {
            var existe = await context.Generos.AnyAsync(g => g.Id == Id);

            if (!existe) return NotFound();

            context.Remove(new Genero { Id = Id });
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}