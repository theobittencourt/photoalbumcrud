namespace PhotoAlbumAPI.Models;

public class Photo
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime AcquisitionDate { get; set; }
    public long Size { get; set; }
    public string DominantColor { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int AlbumId { get; set; }
    public DateTime CreatedAt { get; set; }
}
