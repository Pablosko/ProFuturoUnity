using System.Collections.Generic;
using UnityEngine.Tilemaps;
using UnityEngine;
using System.Collections;


public class MazeGame : Game
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

    [Header("Floor Tiles")]
    public Tile Floor;

    [Header("Prefabs")]
    public GameObject connectionPrefab;

    private ConnectionPoint startPoint;
    private ConnectionPoint currentConnection;
    private Vector3Int lastPosition;
    private Color currentColor;
    private TipoConexion currentType;

    private bool isPlacing = false;
    private List<Vector3Int> currentPath = new();
    public int connections = 0;
    public int neededConnections = 4;

    private void Awake() => Instance = this;
    public override void Start()
    {
        base.Start();
        GenerateTriggers();
    }
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

        if (mouseCell != lastPosition &&
            tilemap.GetTile(mouseCell) == Floor &&
            cableTilemap.GetTile(mouseCell) == null)
        {
            if (IsAdjacent(mouseCell, lastPosition) && HasNeighborWithFloor(mouseCell))
            {
                PlaceCable(lastPosition, mouseCell, currentColor);
                Debug.Log($"[MazeGame] ➕ Placed cable at {mouseCell}");
                lastPosition = mouseCell;
                currentPath.Add(mouseCell);
            }
        }

        if (Input.GetMouseButtonUp(0)) CancelConnection();

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
        Collider2D hit = Physics2D.OverlapPoint(tilemap.GetCellCenterWorld(cell));
        if (hit && hit.TryGetComponent(out ConnectionPoint endPoint))
        {
            if (endPoint == startPoint)
                return false;

            var startTile = startPoint.tile;
            var endTile = endPoint.tile;

            if (endTile == null)
            {
                Debug.Log("[MazeGame] ⛔ No se puede conectar a un punto sin tile.");
                CancelConnection();
                return false;
            }

            if (!startTile.CheckConnection(endTile))
            {
                Debug.Log("[MazeGame] ❌ Tipos incompatibles.");
                CancelConnection();
                return false;
            }

            // Colocar el último tramo del cable antes de finalizar la conexión
            PlaceCable(lastPosition, cell, currentColor);
            currentPath.Add(cell);
            FaceLastTo(cell);

            startPoint.SetPatch(currentPath);
            endPoint.OnConect();
            startPoint.OnConect();
            StopPlacingCable();
            connections++;
            if (connections >= 4)
                TerminateGame();

            Debug.Log($"✅ Conexión completada. Total: {connections}");
            return true;
        }

        return false;
    }


    public void StartPlacingCable(ConnectionPoint point, Color color)
    {

        if (point.tile != null && point.tile.HasCable())
        {
            foreach (var pos in point.tile.cablePath)
            {
                cableTilemap.SetTile(pos, null);
                cableTilemap.SetColor(pos, Color.white);
            }
            point.tile.ClearPath();
        }
        startPoint = point;
        currentConnection = point;
        currentType = point.tipo;
        currentColor = color;
        lastPosition = cableTilemap.WorldToCell(point.transform.position);

        currentPath.Clear();
        currentPath.Add(lastPosition);
        isPlacing = true;

        Debug.Log($"[MazeGame] 🟢 Start placing cable at {lastPosition} with color {color}");
    }
public void CancelConnection()
{
     startPoint.animator.SetBool("Selected", false);
        isPlacing = false;
    if (currentPath != null && currentPath.Count > 0)
    {
        List<Vector3Int> toFade = new(currentPath);
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
        Debug.Log($"[MazeGame] ❌ Removing {tiles.Count} cable tiles...");

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
            Debug.Log($"[MazeGame] 🪑 Tile at {pos} removed.");
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

    private bool HasNeighborWithFloor(Vector3Int pos)
    {
        foreach (Vector3Int dir in new[] { Vector3Int.right, Vector3Int.left, Vector3Int.up, Vector3Int.down })
        {
            Vector3Int neighbor = pos + dir;
            if (tilemap.GetTile(neighbor) == Floor)
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

            if (!cableTilemap.HasTile(vecino) && tilemap.GetTile(vecino) == Floor && HasNeighborWithFloor(vecino))
                return true;
        }
        return false;
    }

    private void TryMoveCableInDirection(Vector3Int direction)
    {
        Vector3Int next = lastPosition + direction;

        if (!tilemap.cellBounds.Contains(next)) return;
        if (CheckForEndConnection(next)) return;
        if (cableTilemap.HasTile(next)) return;
        if (tilemap.GetTile(next) != Floor) return;

        if (HasNeighborWithFloor(next))
        {
            PlaceCable(lastPosition, next, currentColor);
            Debug.Log($"[MazeGame] ➕ Placed cable with arrow key at {next}");
            lastPosition = next;
            currentPath.Add(next);
        }
    }

    public void GenerateTriggers()
    {
        foreach (var pos in tilemap.cellBounds.allPositionsWithin)
        {
            if (tilemap.GetTile(pos) is ConnectionTile conTile)
            {
                Vector3 worldPos = tilemap.GetCellCenterWorld(pos);
                GameObject trigger = Instantiate(connectionPrefab, worldPos, Quaternion.identity,transform);
                trigger.GetComponent<BoxCollider2D>().isTrigger = true;
                trigger.GetComponent<BoxCollider2D>().size = new Vector2(45.69503f, 45.69503f);
                trigger.gameObject.transform.localScale = Vector2.one;
                trigger.GetComponent<ConnectionPoint>().tipo = conTile.tipo;
            }
        }
    }
}