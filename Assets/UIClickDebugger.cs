using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class UIClickDebugger : MonoBehaviour
{
    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            PointerEventData pointerData = new PointerEventData(EventSystem.current)
            {
                position = Input.mousePosition
            };

            List<RaycastResult> results = new List<RaycastResult>();
            EventSystem.current.RaycastAll(pointerData, results);

            if (results.Count == 0)
            {
                Debug.Log("🟢 Nada interceptó el clic.");
            }
            else
            {
                Debug.Log("🔍 Objetos interceptando el clic:");
                foreach (var result in results)
                {
                    Debug.Log($"▶️ {result.gameObject.name}");
                }
            }
        }
    }
}
