
using API.Extensions;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseRouting();

app.UseCors(builder => builder.AllowCredentials().AllowAnyMethod().WithOrigins("http://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";

    if (app.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
    }
    else
    {

        spa.Options.StartupTimeout = TimeSpan.FromSeconds(120);
        spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
        {
            OnPrepareResponse = context =>
            {

                context.Context.Response.Headers["Cache-Control"] = "public,max-age=31536000";
            }
        };
    }
});

app.Run();
