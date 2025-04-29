using UnityEngine;
using UnityEngine.Tilemaps;

[CreateAssetMenu(menuName = "Tiles/Connection Tile")]
public class ConnectionTile : Tile
{
    public TipoConexion tipo;
    public Color tileColor;

    public override void GetTileData(Vector3Int position, ITilemap tilemap, ref TileData tileData)
    {
        base.GetTileData(position, tilemap, ref tileData);

        // ¡ESTO ES CLAVE! Desbloquea el color
        tileData.flags &= ~TileFlags.LockColor;

        switch (tipo)
        {
            case TipoConexion.Public: tileData.color = Color.green; break;
            case TipoConexion.Confidential: tileData.color = Color.red; break;
            case TipoConexion.Private: tileData.color = Color.blue; break;
            case TipoConexion.Restricted: tileData.color = Color.yellow; break;
        }
        tileColor = tileData.color;
    }
}
