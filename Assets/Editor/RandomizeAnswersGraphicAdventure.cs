using UnityEditor;
using UnityEngine;
using System.IO;

public class RandomizeAnswersGraphicAdventure : EditorWindow
{
    private string adventureName = "";

    [MenuItem("Tools/Randomizar Respuestas Aventura Gráfica")]
    public static void ShowWindow()
    {
        GetWindow<RandomizeAnswersGraphicAdventure>("Randomizar Respuestas");
    }

    void OnGUI()
    {
        GUILayout.Label("Randomizar respuestas de Aventura Gráfica", EditorStyles.boldLabel);
        adventureName = EditorGUILayout.TextField("Nombre de la Aventura (deja vacío para todas)", adventureName);

        if (GUILayout.Button("Randomizar"))
        {
            RandomizeAll(adventureName);
        }
    }

    void RandomizeAll(string adventureNameInput)
    {
        string basePath = "Assets/Resources/ScriptableObjects/AventuraGrafica";
        int counter = 0;

        string[] adventureDirs = Directory.GetDirectories(basePath);
        foreach (string dir in adventureDirs)
        {
            string adventureDirName = Path.GetFileName(dir);

            if (!string.IsNullOrEmpty(adventureNameInput) && !adventureDirName.Equals(adventureNameInput))
                continue;

            string[] subDirs = Directory.GetDirectories(dir);
            foreach (string subDir in subDirs)
            {
                string[] assets = Directory.GetFiles(subDir, "*_Selection.asset");
                foreach (string assetPath in assets)
                {
                    GraphicAdventureData data = AssetDatabase.LoadAssetAtPath<GraphicAdventureData>(assetPath);
                    if (data != null && !string.IsNullOrEmpty(data.leftOption) && !string.IsNullOrEmpty(data.rightOption))
                    {
                        if (Random.value > 0.5f)
                        {
                            string temp = data.leftOption;
                            data.leftOption = data.rightOption;
                            data.rightOption = temp;
                            data.rigthCorrect = !data.rigthCorrect;

                            EditorUtility.SetDirty(data);
                            counter++;
                            Debug.Log("🔀 Randomizado: " + assetPath);
                        }
                    }
                }
            }
        }

        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();
        Debug.Log($"✅ Randomización completada. Total: {counter} elementos modificados.");
    }
}
