using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoAlbumAPI.Services;

namespace PhotoAlbumAPI.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class PhotosController : ControllerBase
{
    private readonly PhotoService _photoService;

    public PhotosController(PhotoService photoService)
    {
        _photoService = photoService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("albums/{albumId}/photos")]
    public async Task<IActionResult> GetPhotos(int albumId)
    {
        var photos = await _photoService.GetAlbumPhotos(albumId, GetUserId());
        return Ok(photos);
    }

    [HttpPost("albums/{albumId}/photos")]
    public async Task<IActionResult> UploadPhoto(int albumId, [FromForm] PhotoUploadRequest request)
    {
        if (request.File == null)
            return BadRequest(new { message = "Arquivo obrigatório" });

        var photo = await _photoService.CreatePhoto(
            albumId,
            GetUserId(),
            request.File,
            request.Title,
            request.Description,
            request.AcquisitionDate
        );

        if (photo == null)
            return NotFound(new { message = "Álbum não encontrado" });

        return CreatedAtAction(nameof(GetPhotos), new { albumId }, photo);
    }

    [HttpDelete("photos/{id}")]
    public async Task<IActionResult> DeletePhoto(int id)
    {
        var success = await _photoService.DeletePhoto(id, GetUserId());
        if (!success)
            return NotFound();

        return NoContent();
    }
}

public class PhotoUploadRequest
{
    public IFormFile File { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime AcquisitionDate { get; set; }
}
