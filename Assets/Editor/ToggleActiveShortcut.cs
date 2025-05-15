using UnityEditor;
using UnityEngine;

public class ToggleActiveShortcut
{
    [MenuItem("Tools/Toggle Active State %t")] // %t = Ctrl+T (Cmd+T en Mac)
    static void ToggleSelectedObject()
    {
        foreach (GameObject obj in Selection.gameObjects)
        {
            Undo.RecordObject(obj, "Toggle Active State");
            obj.SetActive(!obj.activeSelf);
        }
    }
}