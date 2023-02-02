using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using PeliculasAPI;
using PeliculasAPI.Utilidades;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var services = builder.Services;

//Configuration
var configuration = builder.Configuration;

services.AddHttpContextAccessor();

services.AddScoped<IAlmacenadorArchivos, AlmacenadorArchivosLocal>();

services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
services.AddSingleton<GeometryFactory>(NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));
services.AddSingleton(provider => 
    new MapperConfiguration(config => {
        var geometryFactory = provider.GetRequiredService<GeometryFactory>();
        config.AddProfile(new AutoMapperProfiles(geometryFactory));
    }).CreateMapper());

services.AddDbContext<ApplicationDbContext>(options => 
{
    options.UseSqlServer(configuration.GetConnectionString("defaultConnection"),
        sqlserver => sqlserver.UseNetTopologySuite());
});

services.AddCors(options => {
    var frontend_url = configuration.GetValue<string>("frontend_url");
    options.AddDefaultPolicy(builder => {        
        builder.WithOrigins(frontend_url)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders(new string[]{"cantidadTotalRegistros"});
    });
});

JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opciones => opciones.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["llavejwt"])),
        ClockSkew = TimeSpan.Zero
    });

services.AddAuthorization(options =>
{
    options.AddPolicy("EsAdmin", (policy) => policy.RequireClaim("role", "admin"));
});

services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
