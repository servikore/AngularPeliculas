using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PeliculasAPI.Migrations
{
    public partial class RatingsSetUsuariIdstring : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ratins_AspNetUsers_UsuarioId1",
                table: "Ratins");

            migrationBuilder.DropIndex(
                name: "IX_Ratins_UsuarioId1",
                table: "Ratins");

            migrationBuilder.DropColumn(
                name: "UsuarioId1",
                table: "Ratins");

            migrationBuilder.AlterColumn<string>(
                name: "UsuarioId",
                table: "Ratins",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Ratins_UsuarioId",
                table: "Ratins",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ratins_AspNetUsers_UsuarioId",
                table: "Ratins",
                column: "UsuarioId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ratins_AspNetUsers_UsuarioId",
                table: "Ratins");

            migrationBuilder.DropIndex(
                name: "IX_Ratins_UsuarioId",
                table: "Ratins");

            migrationBuilder.AlterColumn<int>(
                name: "UsuarioId",
                table: "Ratins",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UsuarioId1",
                table: "Ratins",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ratins_UsuarioId1",
                table: "Ratins",
                column: "UsuarioId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Ratins_AspNetUsers_UsuarioId1",
                table: "Ratins",
                column: "UsuarioId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
