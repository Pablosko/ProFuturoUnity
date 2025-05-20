using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class CursorChanger : MonoBehaviour
{
    public Texture2D defaultCursor;
    public Texture2D interactCursor;
    public Vector2 offsetCursor;
    public Vector2 offsetSelect;
    void Update()
    {
        bool overInteractable = false;

        // 1. Detectar UI con EventSystem.RaycastAll
        PointerEventData pointerData = new PointerEventData(EventSystem.current)
        {
            position = Input.mousePosition
        };

        List<RaycastResult> results = new List<RaycastResult>();
        EventSystem.current.RaycastAll(pointerData, results);

        foreach (var result in results)
        {
            // Detecta elementos interactuables (botones, toggles, sliders, etc.)
            if (result.gameObject.GetComponent<Selectable>() != null)
            {
                overInteractable = true;
                break;
            }
        }

        // 2. (Opcional) Detectar objetos 3D con collider y tag "Interactable"
        if (!overInteractable)
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out RaycastHit hit))
            {
                if (hit.collider.CompareTag("Interactable"))
                {
                    overInteractable = true;
                }
            }
        }

        // 3. Cambiar el cursor
        Cursor.SetCursor(overInteractable ? interactCursor : defaultCursor, overInteractable ? offsetSelect : offsetCursor, CursorMode.Auto);
    }
}
