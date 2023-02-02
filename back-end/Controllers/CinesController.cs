using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PeliculasAPI.Controllers
{
    [Route("api/cines")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "EsAdmin")]
    public class CinesController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;

        public CinesController(ApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        // GET: api/<CinesController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CineDTO>>> Get([FromQuery] PaginacionDTO paginacionDTO)
        {
            var queryable = context.Cines.AsQueryable();
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);

            var cines = await queryable.OrderBy(g => g.Nombre)
                .Paginar(paginacionDTO).AsNoTracking().ToListAsync();

            return mapper.Map<List<CineDTO>>(cines);
        }

        // GET api/<CinesController>/5
        [HttpGet("{Id:int}")]
        public async Task<ActionResult<CineDTO>> Get(int Id)
        {
            var cine = await context.Cines.AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == Id);

            if (cine == null) return NotFound();

            return mapper.Map<CineDTO>(cine);
        }

        // POST api/<CinesController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] CineCreacionDTO cineCreacionDTO)
        {
            var cine = mapper.Map<Cine>(cineCreacionDTO);
            
            context.Cines.Add(cine);
            await context.SaveChangesAsync();

            return NoContent();
        }

        // PUT api/<CinesController>/5
        [HttpPut("{Id:Int}")]
        public async Task<ActionResult> Put(int Id, [FromBody] CineCreacionDTO cineCreacionDTO)
        {
            var cine = await context.Cines.FirstOrDefaultAsync(c => c.Id == Id);

            if (cine == null) return NotFound();

            mapper.Map(cineCreacionDTO, cine);

            await context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/<CinesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            var existe = await context.Cines.AnyAsync(c => c.Id == Id);

            if (!existe) return NotFound();

            context.Remove(new Cine { Id = Id });
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
