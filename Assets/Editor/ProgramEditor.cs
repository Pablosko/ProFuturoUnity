using static UnityEngine.GraphicsBuffer;
using System.Linq;
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(Program))]
public class ProgramEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();

        Program program = (Program)target;

        if (GUILayout.Button("Load Screens from Resources"))
        {
            LoadScreens(program);
        }
    }

    private void LoadScreens(Program program)
    {
        string basePath = $"ScriptableObjects/Computer/ScreenAssets/{program.programName}";
        ComputerScreenAsset[] loadedScreens = Resources.LoadAll<ComputerScreenAsset>(basePath);

        if (loadedScreens.Length == 0)
        {
            Debug.LogWarning($"No se encontraron pantallas en Resources/{basePath}");
        }
        else
        {
            program.screens = loadedScreens.OrderBy(s => s.name).ToList();
            EditorUtility.SetDirty(program);
            Debug.Log($"Cargadas {loadedScreens.Length} pantallas para el programa \"{program.programName}\"");
        }
    }
}