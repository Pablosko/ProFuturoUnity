using UnityEngine;
using UnityEngine.Tilemaps;
using System.Collections;
using System.Collections.Generic;

public class MazeGame : MonoBehaviour
{
    public static MazeGame Instance;

    [Header("Tilemaps")]
    public Tilemap tilemap;
    public Tilemap cableTilemap;

    [Header("Cable Tiles")]
    public Tile cableHorizontal;
    public Tile cableVertical;
    public Tile cableCorner1, cableCorner2, cableCorner3, cableCorner4;
    public Tile up, down, rigth, left;

    [Header("Prefabs")]
    public GameObject connectionPrefab;

    private ConnectionPoint startPoint;
    private ConnectionPoint currentConnection;
    private Vector3Int lastPosition;
    private Color currentColor;
    private TipoConexion currentType;

    private bool isPlacing = false;
    private List<Vector3Int> currentPath = new();

    private void Awake() => Instance = this;
    private void Start() => GenerateTriggers();

    private void Update()
    {
        if (!isPlacing) return;

        Vector3 mouseWorld = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        Vector3Int mouseCell = cableTilemap.WorldToCell(mouseWorld);

        if (CheckForEndConnection(mouseCell)) return;
        if (!HayMovimientoPosibleDesde(lastPosition))
        {
            CancelConnection();
            return;
        }

        if (mouseCell != lastPosition && cableTilemap.GetTile(mouseCell) == null)
        {
            if (IsAdjacent(mouseCell, lastPosition) && HasNeighborWithColor(mouseCell, currentColor))
            {
                PlaceCable(lastPosition, mouseCell, currentColor);
                lastPosition = mouseCell;
                currentPath.Add(mouseCell);
                currentConnection.path.Add(mouseCell);
            }
        }

        if (Input.GetMouseButtonDown(1)) CancelConnection();
        HandleWASDInput();
    }

    private void HandleWASDInput()
    {
        if (Input.GetKeyDown(KeyCode.D)) TryMoveCableInDirection(Vector3Int.right);
        else if (Input.GetKeyDown(KeyCode.W)) TryMoveCableInDirection(Vector3Int.up);
        else if (Input.GetKeyDown(KeyCode.A)) TryMoveCableInDirection(Vector3Int.left);
        else if (Input.GetKeyDown(KeyCode.S)) TryMoveCableInDirection(Vector3Int.down);
    }

    private bool CheckForEndConnection(Vector3Int cell)
    {
        Collider2D hit = Physics2D.OverlapPoint(cableTilemap.GetCellCenterWorld(cell));
        if (hit && hit.TryGetComponent(out ConnectionPoint endPoint))
        {
            if (endPoint != startPoint && endPoint.tipo == currentType)
            {
                endPoint.OnConect();
                startPoint.OnConect();
                FaceLastTo(cell); // 🔁 orienta la última tile
                StopPlacingCable();
                return true;
            }
        }
        return false;
    }

    public void StartPlacingCable(ConnectionPoint point, Color color)
    {
        startPoint = point;
        currentConnection = point;
        currentType = point.tipo;
        currentColor = color;
        lastPosition = cableTilemap.WorldToCell(point.transform.position);

        point.path.Clear();
        point.path.Add(lastPosition);
        currentPath.Clear();
        currentPath.Add(lastPosition);
        isPlacing = true;
    }

    public void CancelConnection()
    {
        isPlacing = false;
        if (currentConnection != null && currentConnection.path.Count > 1)
        {
            List<Vector3Int> toFade = new(currentConnection.path);
            toFade.RemoveAt(0);
            StartCoroutine(FadeAndRemoveTiles(toFade));
        }
        startPoint = null;
        currentConnection = null;
    }

    public void StopPlacingCable()
    {
        isPlacing = false;
        FinalizeCable();
    }

    private void FinalizeCable()
    {
        startPoint = null;
        currentConnection = null;
        currentPath.Clear();
    }

    private void FaceLastTo(Vector3Int target)
    {
        if (currentPath.Count < 2) return;

        var last = currentPath[^1];
        var prev = currentPath[^2];
        var dirFrom = last - prev;
        var dirTo = target - last;

        Tile newTile = GetBodyTile(dirFrom, dirTo);
        if (newTile != null)
        {
            cableTilemap.SetTile(last, newTile);
            cableTilemap.SetColor(last, currentColor);
        }
    }

    private IEnumerator FadeAndRemoveTiles(List<Vector3Int> tiles, float duration = 0.5f)
    {
        float elapsed = 0f;
        Dictionary<Vector3Int, Color> originalColors = new();
        foreach (var pos in tiles) originalColors[pos] = cableTilemap.GetColor(pos);

        while (elapsed < duration)
        {
            float alpha = Mathf.Lerp(1f, 0f, elapsed / duration);
            foreach (var pos in tiles)
            {
                if (cableTilemap.HasTile(pos))
                {
                    var c = originalColors[pos];
                    c.a = alpha;
                    cableTilemap.SetColor(pos, c);
                }
            }
            elapsed += Time.deltaTime;
            yield return null;
        }

        foreach (var pos in tiles)
        {
            cableTilemap.SetTile(pos, null);
            cableTilemap.SetColor(pos, Color.white);
        }
    }

    public void PlaceCable(Vector3Int from, Vector3Int to, Color color)
    {
        Vector3Int dir = to - from;
        Tile endCapTile = GetEndCapTile(dir);

        if (currentPath.Count >= 2)
        {
            var prev = currentPath[^2];
            var current = currentPath[^1];
            var dirFrom = current - prev;
            var dirTo = to - current;
            Tile midTile = GetBodyTile(dirFrom, dirTo);
            if (midTile != null)
            {
                cableTilemap.SetTile(current, midTile);
                cableTilemap.SetColor(current, color);
            }
        }

        if (endCapTile != null)
        {
            cableTilemap.SetTile(to, endCapTile);
            cableTilemap.SetColor(to, color);
        }
    }

    private Tile GetEndCapTile(Vector3Int dir) => dir switch
    {
        var d when d == Vector3Int.up => up,
        var d when d == Vector3Int.down => down,
        var d when d == Vector3Int.left => left,
        var d when d == Vector3Int.right => rigth,
        _ => null
    };

    private Tile GetBodyTile(Vector3Int from, Vector3Int to)
    {
        if (from.x != to.x && from.y != to.y)
        {
            if ((from == Vector3Int.up && to == Vector3Int.right) || (from == Vector3Int.left && to == Vector3Int.down)) return cableCorner1;
            if ((from == Vector3Int.up && to == Vector3Int.left) || (from == Vector3Int.right && to == Vector3Int.down)) return cableCorner2;
            if ((from == Vector3Int.down && to == Vector3Int.left) || (from == Vector3Int.right && to == Vector3Int.up)) return cableCorner3;
            if ((from == Vector3Int.down && to == Vector3Int.right) || (from == Vector3Int.left && to == Vector3Int.up)) return cableCorner4;
        }
        else
        {
            if (to.x != 0) return cableHorizontal;
            if (to.y != 0) return cableVertical;
        }
        return null;
    }

    private bool IsAdjacent(Vector3Int a, Vector3Int b)
    {
        Vector3Int delta = a - b;
        return Mathf.Abs(delta.x) + Mathf.Abs(delta.y) == 1;
    }

    private bool HasNeighborWithColor(Vector3Int pos, Color color)
    {
        if (currentPath.Count == 1 && pos == currentPath[0]) return true;

        foreach (Vector3Int dir in new[] { Vector3Int.right, Vector3Int.left, Vector3Int.up, Vector3Int.down })
        {
            Vector3Int neighbor = pos + dir;
            if (cableTilemap.HasTile(neighbor) && cableTilemap.GetColor(neighbor) == color)
                return true;
        }
        return false;
    }

    private bool HayMovimientoPosibleDesde(Vector3Int pos)
    {
        foreach (Vector3Int dir in new[] { Vector3Int.right, Vector3Int.left, Vector3Int.up, Vector3Int.down })
        {
            Vector3Int vecino = pos + dir;
            if (!tilemap.cellBounds.Contains(vecino)) continue;

            Collider2D hit = Physics2D.OverlapPoint(cableTilemap.GetCellCenterWorld(vecino));
            if (hit && hit.TryGetComponent(out ConnectionPoint cp) && cp.tipo == currentType && cp != startPoint)
                return true;

            if (!cableTilemap.HasTile(vecino) && HasNeighborWithColor(vecino, currentColor))
                return true;
        }
        return false;
    }
    private void TryMoveCableInDirection(Vector3Int direction)
    {
        Vector3Int next = lastPosition + direction;
        if (!tilemap.cellBounds.Contains(next)) return;

        if (CheckForEndConnection(next)) return;

        // Solo colocar cable si no hay tile aún (los ConnectionPoint no usan tile en el tilemap)
        if (cableTilemap.HasTile(next)) return;

        if (HasNeighborWithColor(next, currentColor))
        {
            PlaceCable(lastPosition, next, currentColor);
            lastPosition = next;
            currentPath.Add(next);
            currentConnection.path.Add(next);
        }
    }
    public void GenerateTriggers()
    {
        foreach (var pos in tilemap.cellBounds.allPositionsWithin)
        {
            if (tilemap.GetTile(pos) is ConnectionTile conTile)
            {
                Vector3 worldPos = tilemap.GetCellCenterWorld(pos);
                GameObject trigger = Instantiate(connectionPrefab, worldPos, Quaternion.identity);
                trigger.GetComponent<BoxCollider2D>().isTrigger = true;
                trigger.GetComponent<ConnectionPoint>().tipo = conTile.tipo;
            }
        }
    }
}
