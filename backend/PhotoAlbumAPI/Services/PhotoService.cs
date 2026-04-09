using System.Data;
using Amazon.S3;
using Amazon.S3.Model;
using Dapper;
using PhotoAlbumAPI.Models;

namespace PhotoAlbumAPI.Services;

public class PhotoService
{
    private readonly IDbConnection _db;
    private readonly IAmazonS3 _s3;
    private readonly string _bucket;

    public PhotoService(IDbConnection db, IAmazonS3 s3, IConfiguration config)
    {
        _db = db;
        _s3 = s3;
        _bucket = config["AWS:BucketName"]!;
    }

    private string GeneratePresignedUrl(string key)
    {
        return _s3.GetPreSignedURL(new GetPreSignedUrlRequest
        {
            BucketName = _bucket,
            Key = key,
            Expires = DateTime.UtcNow.AddHours(1)
        });
    }

    public async Task<IEnumerable<Photo>> GetAlbumPhotos(int albumId, int userId)
    {
        var albumExists = await _db.ExecuteScalarAsync<bool>(
            "SELECT COUNT(1) FROM albums WHERE id = @AlbumId AND user_id = @UserId",
            new { AlbumId = albumId, UserId = userId });

        if (!albumExists) return [];

        var photos = await _db.QueryAsync<Photo>(
            "SELECT * FROM photos WHERE album_id = @AlbumId ORDER BY created_at DESC",
            new { AlbumId = albumId });

        foreach (var photo in photos)
            photo.Url = GeneratePresignedUrl(photo.Url);

        return photos;
    }

    public async Task<Photo?> CreatePhoto(int albumId, int userId, IFormFile file, string title, string description, DateTime acquisitionDate)
    {
        var albumExists = await _db.ExecuteScalarAsync<bool>(
            "SELECT COUNT(1) FROM albums WHERE id = @AlbumId AND user_id = @UserId",
            new { AlbumId = albumId, UserId = userId });

        if (!albumExists) return null;

        var key = $"photos/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        using var stream = file.OpenReadStream();
        await _s3.PutObjectAsync(new PutObjectRequest
        {
            BucketName = _bucket,
            Key = key,
            InputStream = stream,
            ContentType = file.ContentType
        });

        var id = await _db.ExecuteScalarAsync<int>(@"
            INSERT INTO photos (title, description, acquisition_date, size, dominant_color, url, album_id)
            VALUES (@Title, @Description, @AcquisitionDate, @Size, @DominantColor, @Url, @AlbumId)
            RETURNING id",
            new
            {
                Title = title,
                Description = description,
                AcquisitionDate = acquisitionDate,
                Size = file.Length,
                DominantColor = "#000000",
                Url = key,
                AlbumId = albumId
            });

        var photo = await _db.QueryFirstOrDefaultAsync<Photo>(
            "SELECT * FROM photos WHERE id = @Id", new { Id = id });

        if (photo != null)
            photo.Url = GeneratePresignedUrl(photo.Url);

        return photo;
    }

    public async Task<bool> DeletePhoto(int id, int userId)
    {
        var photo = await _db.QueryFirstOrDefaultAsync<Photo>(@"
            SELECT p.* FROM photos p
            INNER JOIN albums a ON a.id = p.album_id
            WHERE p.id = @Id AND a.user_id = @UserId",
            new { Id = id, UserId = userId });

        if (photo == null) return false;

        await _s3.DeleteObjectAsync(new DeleteObjectRequest
        {
            BucketName = _bucket,
            Key = photo.Url
        });

        await _db.ExecuteAsync("DELETE FROM photos WHERE id = @Id", new { Id = id });
        return true;
    }
}
