using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

[CreateAssetMenu(menuName = "Tiles/Connection Tile")]
public class ConnectionTile : Tile
{
    public TipoConexion tipo;
    public Color tileColor;
    public bool input;
    public List<Vector3Int> cablePath = new();

    public override void GetTileData(Vector3Int position, ITilemap tilemap, ref TileData tileData)
    {
        base.GetTileData(position, tilemap, ref tileData);
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

    public void SavePath(List<Vector3Int> path)
    {
        cablePath.Clear();
        cablePath.AddRange(path);
    }

    public void ClearPath()
    {
        cablePath.Clear();
    }

    public bool HasCable() => cablePath.Count > 0;

    public bool CheckConnection(ConnectionTile other) => other.tipo == tipo;
}
