using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.Entidades;

namespace PeliculasAPI;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    public DbSet<Genero> Generos {get;set;}
    public DbSet<Actor> Actores {get;set; }
    public DbSet<Cine> Cines {get;set; }
    public DbSet<Pelicula> Peliculas {get;set; }
    public DbSet<PeliculasActores> PeliculasActores {get;set; }
    public DbSet<PeliculasGeneros> PeliculasGeneros {get;set; }
    public DbSet<PeliculasCines> PeliculasCines {get;set; }
    public DbSet<Rating> Ratins {get;set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PeliculasActores>()
            .HasKey(pa => new { pa.PeliculaId, pa.ActorId });

        modelBuilder.Entity<PeliculasGeneros>()
            .HasKey(pg => new { pg.PeliculaId, pg.GeneroId });

        modelBuilder.Entity<PeliculasCines>()
            .HasKey(pc => new { pc.PeliculaId, pc.CineId });

        base.OnModelCreating(modelBuilder);
    }
}
