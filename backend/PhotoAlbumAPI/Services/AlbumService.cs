using System.Data;
using Dapper;
using PhotoAlbumAPI.Models;

namespace PhotoAlbumAPI.Services;

public class AlbumService
{
    private readonly IDbConnection _db;

    public AlbumService(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Album>> GetUserAlbums(int userId)
    {
        return await _db.QueryAsync<Album>(@"
            SELECT a.*, COUNT(p.id) AS photos_count
            FROM albums a
            LEFT JOIN photos p ON p.album_id = a.id
            WHERE a.user_id = @UserId
            GROUP BY a.id
            ORDER BY a.created_at DESC",
            new { UserId = userId });
    }

    public async Task<Album?> GetAlbum(int id, int userId)
    {
        return await _db.QueryFirstOrDefaultAsync<Album>(
            "SELECT * FROM albums WHERE id = @Id AND user_id = @UserId",
            new { Id = id, UserId = userId });
    }

    public async Task<Album> CreateAlbum(string title, string description, int userId)
    {
        var id = await _db.ExecuteScalarAsync<int>(
            "INSERT INTO albums (title, description, user_id) VALUES (@Title, @Description, @UserId) RETURNING id",
            new { Title = title, Description = description, UserId = userId });

        return (await GetAlbum(id, userId))!;
    }

    public async Task<bool> UpdateAlbum(int id, int userId, string title, string description)
    {
        var rows = await _db.ExecuteAsync(
            "UPDATE albums SET title = @Title, description = @Description WHERE id = @Id AND user_id = @UserId",
            new { Title = title, Description = description, Id = id, UserId = userId });

        return rows > 0;
    }

    public async Task<bool> DeleteAlbum(int id, int userId)
    {
        var hasPhotos = await _db.ExecuteScalarAsync<bool>(
            "SELECT COUNT(1) FROM photos WHERE album_id = @AlbumId", new { AlbumId = id });

        if (hasPhotos) return false;

        var rows = await _db.ExecuteAsync(
            "DELETE FROM albums WHERE id = @Id AND user_id = @UserId",
            new { Id = id, UserId = userId });

        return rows > 0;
    }
}
