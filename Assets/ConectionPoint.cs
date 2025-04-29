using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
public enum TipoConexion { Public, Confidential, Private, Restricted }

public class ConnectionPoint : MonoBehaviour, IPointerClickHandler
{
    public TipoConexion tipo;
    public List<Vector3Int> path = new List<Vector3Int>();
    public ParticleSystem onConnectParticleSystem;
    public void OnPointerClick(PointerEventData eventData)
    {
        Vector3Int cellPos = MazeGame.Instance.tilemap.WorldToCell(transform.position);
        var tile = MazeGame.Instance.tilemap.GetTile(cellPos);

        if (tile is ConnectionTile conTile)
        {
            MazeGame.Instance.StartPlacingCable(this, conTile.tileColor);
        }
    }
    public void OnConect()
    {
        if (onConnectParticleSystem != null)
        {
            onConnectParticleSystem.Play();
        }
    }
}
