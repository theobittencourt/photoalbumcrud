using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoAlbumAPI.Models;
using PhotoAlbumAPI.Services;

namespace PhotoAlbumAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AlbumsController : ControllerBase
{
    private readonly AlbumService _albumService;

    public AlbumsController(AlbumService albumService)
    {
        _albumService = albumService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAlbums()
    {
        var albums = await _albumService.GetUserAlbums(GetUserId());
        return Ok(albums);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAlbum(int id)
    {
        var album = await _albumService.GetAlbum(id, GetUserId());
        if (album == null)
            return NotFound();

        return Ok(album);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAlbum([FromBody] AlbumRequest request)
    {
        var album = await _albumService.CreateAlbum(request.Title, request.Description, GetUserId());
        return CreatedAtAction(nameof(GetAlbum), new { id = album.Id }, album);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAlbum(int id, [FromBody] AlbumRequest request)
    {
        var success = await _albumService.UpdateAlbum(id, GetUserId(), request.Title, request.Description);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAlbum(int id)
    {
        var success = await _albumService.DeleteAlbum(id, GetUserId());
        if (!success)
            return BadRequest(new { message = "Álbum não encontrado ou contém fotos" });

        return NoContent();
    }
}

public record AlbumRequest(string Title, string Description);
