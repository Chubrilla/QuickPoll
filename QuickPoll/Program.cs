using Microsoft.EntityFrameworkCore;
using QuickPoll.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=quickpoll.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
var app = builder.Build();

app.UseDefaultFiles(); // Автоматически ищет index.html
app.UseStaticFiles();  // Разрешает доступ к wwwroot

app.UseRouting();
app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI();

app.UseEndpoints(endpoints => {
    endpoints.MapControllers();
});

app.Run("http://localhost:5000");
