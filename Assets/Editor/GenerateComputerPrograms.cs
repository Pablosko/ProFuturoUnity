using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;

public class GenerateComputerPrograms : EditorWindow
{
    private GameObject defaultPrefab;
    private Object draggedJsonFile;

    private const string DEFAULT_PREFAB_PATH = "Prefabs/ComputerInnerScreenPrefabs/TextOnlyComputerScreen";

    [MenuItem("Tools/GenerateProgram")]
    public static void ShowWindow()
    {
        GetWindow<GenerateComputerPrograms>("Generate Program");
    }

    private void OnEnable()
    {
        // Carga el prefab por defecto desde Resources
        if (defaultPrefab == null)
        {
            defaultPrefab = Resources.Load<GameObject>(DEFAULT_PREFAB_PATH);
            if (defaultPrefab == null)
            {
                Debug.LogWarning($"No se encontró el prefab por defecto en Resources/{DEFAULT_PREFAB_PATH}. Por favor verifica la ruta.");
            }
        }
    }

    void OnGUI()
    {
        GUILayout.Label("Configuración", EditorStyles.boldLabel);
        defaultPrefab = (GameObject)EditorGUILayout.ObjectField("Screen Prefab (opcional)", defaultPrefab, typeof(GameObject), false);

        GUILayout.Space(10);

        GUILayout.Label("Arrastra un archivo .json:", EditorStyles.boldLabel);
        draggedJsonFile = EditorGUILayout.ObjectField("Archivo JSON", draggedJsonFile, typeof(TextAsset), false);

        if (GUILayout.Button("Generar desde archivo JSON"))
        {
            if (draggedJsonFile != null)
            {
                string assetPath = AssetDatabase.GetAssetPath(draggedJsonFile);
                string fullPath = Path.Combine(Directory.GetCurrentDirectory(), assetPath);
                GenerateFromJSONFile(fullPath);
            }
            else
            {
                EditorUtility.DisplayDialog("Error", "Por favor arrastra un archivo .json válido.", "OK");
            }
        }

        GUILayout.Space(10);

        GUILayout.Label("O selecciona carpeta con múltiples programas:", EditorStyles.boldLabel);

        if (GUILayout.Button("Seleccionar carpeta y generar"))
        {
            string folderPath = EditorUtility.OpenFolderPanel("Selecciona carpeta con archivos JSON", Application.dataPath, "");
            if (!string.IsNullOrEmpty(folderPath))
            {
                GenerateFromJSONFolder(folderPath);
            }
        }
    }

    private void GenerateFromJSONFolder(string folderPath)
    {
        string[] jsonFiles = Directory.GetFiles(folderPath, "*.json");
        foreach (string path in jsonFiles)
        {
            GenerateFromJSONFile(path);
        }

        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();
        Debug.Log("Generación completa desde carpeta.");
    }

    private void GenerateFromJSONFile(string path)
    {
        if (!File.Exists(path)) return;

        string json = File.ReadAllText(path);
        ProgramData programData = JsonUtility.FromJson<ProgramData>(json);
        string programName = Path.GetFileNameWithoutExtension(path);

        string targetDir = $"Assets/Resources/ScriptableObjects/Computer/ScreenAssets/{programName}";
        if (!Directory.Exists(targetDir))
        {
            Directory.CreateDirectory(targetDir);
        }

        for (int i = 0; i < programData.screens.Length; i++)
        {
            ComputerScreenAsset asset = ScriptableObject.CreateInstance<ComputerScreenAsset>();
            asset.screenPrefab = defaultPrefab;
            asset.text = programData.screens[i].text;
            asset.inputData = programData.screens[i].inputData;
            asset.feedbackCorrectText = programData.screens[i].feedbackCorrectText;
            asset.feedbackIncorrectText = programData.screens[i].feedbackIncorrectText;
            asset.image = null;

            string assetPath = $"{targetDir}/{programName}_screen_{i}.asset";
            AssetDatabase.CreateAsset(asset, assetPath);
        }

        Debug.Log($"Generado: {programName} ({programData.screens.Length} pantallas)");
    }

    // Estructuras compatibles con el nuevo JSON

    [System.Serializable]
    private class ProgramData
    {
        public ScreenData[] screens;
    }

    [System.Serializable]
    private class ScreenData
    {
        public string text;
        public InputData inputData;
        public string feedbackCorrectText;
        public string feedbackIncorrectText;
    }
}
