using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
public enum TipoConexion { Public, Confidential, Private, Restricted }

public class ConnectionPoint : MonoBehaviour, IPointerDownHandler
{
    public TipoConexion tipo;
    public ParticleSystem onConnectParticleSystem;
    public ConnectionTile tile;
    bool connected = false;
    public Animator animator;
    private void Start()
    {
        Vector3Int cellPos = MazeGame.Instance.tilemap.WorldToCell(transform.position);
        tile = MazeGame.Instance.tilemap.GetTile<ConnectionTile>(cellPos);
        tile.ClearPath();
    }
    public void OnPointerDown(PointerEventData eventData)
    {
        if (tile == null)
            return;
        if (!tile.input)
            animator.SetBool("Selected", true);

        // Si ya tiene un cable conectado → se borra al hacer clic
        if (tile.HasCable())
        {
            MazeGame.Instance.CancelConnection();

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

