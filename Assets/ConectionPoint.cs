using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
public enum TipoConexion { Public, Confidential, Private, Restricted }

public class ConnectionPoint : MonoBehaviour, IPointerClickHandler
{
    public TipoConexion tipo;
    public ParticleSystem onConnectParticleSystem;
    public ConnectionTile tile;
    bool connected = false;
    private void Awake()
    {
        Vector3Int cellPos = MazeGame.Instance.tilemap.WorldToCell(transform.position);
        tile = MazeGame.Instance.tilemap.GetTile<ConnectionTile>(cellPos);
        tile.ClearPath();
    }
    public void OnPointerClick(PointerEventData eventData)
    {
        if (tile == null)
            return;
  

        // Si ya tiene un cable conectado → se borra al hacer clic
        if (tile.HasCable())
        {
            foreach (var pos in tile.cablePath)
            {
                MazeGame.Instance.cableTilemap.SetTile(pos, null);
                MazeGame.Instance.cableTilemap.SetColor(pos, Color.white);
            }
            tile.ClearPath();
            if (connected) 
            {
                MazeGame.Instance.connections--;
                connected = false;
            }

            Debug.Log("🔁 Cable eliminado con segundo click.");
            return;
        }

        // Si es un punto de entrada, no se permite colocar
        if (tile.input)
        {
            Debug.Log("[ConnectionPoint] ⛔ No se puede iniciar desde un punto de entrada.");
            return;
        }
        MazeGame.Instance.CancelConnection();
        // Si no hay cable, comenzamos
        MazeGame.Instance.StartPlacingCable(this, tile.tileColor);
    }

    public void OnConect()
    {
        connected = true;
        if (onConnectParticleSystem != null)
        {
            onConnectParticleSystem.Play();
        }
    }
    public void SetPatch(List<Vector3Int> p) 
    {
        tile.SavePath(p);
    }
}

