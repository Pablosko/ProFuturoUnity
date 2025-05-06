using UnityEditor;
using UnityEngine;
using System.IO;

public class GameQuestionGenerator : EditorWindow
{
    private string jsonInput = "";
    private string basePath = "Assets/Resources/ScriptableObjects/Games/SelectionGame/2";

    [MenuItem("Tools/Generar Preguntas de Juego (Selection)")]
    public static void ShowWindow()
    {
        GetWindow<GameQuestionGenerator>("Generador de Preguntas");
    }

    void OnGUI()
    {
        GUILayout.Label("JSON de Preguntas", EditorStyles.boldLabel);
        jsonInput = EditorGUILayout.TextArea(jsonInput, GUILayout.Height(200));

        if (GUILayout.Button("Generar Preguntas"))
        {
            if (!string.IsNullOrWhiteSpace(jsonInput))
            {
                try
                {
                    string parsedJson = jsonInput.Trim();
                    if (!parsedJson.Contains("\"items\""))
                        parsedJson = "{\"items\":" + parsedJson + "}";

                    var wrapper = JsonUtility.FromJson<Wrapper>(parsedJson);
                    if (wrapper?.items == null || wrapper.items.Length == 0)
                    {
                        Debug.LogError("⚠ El JSON es válido pero no contiene entradas.");
                        return;
                    }

                    GenerateQuestions(wrapper.items);
                }
                catch (System.Exception ex)
                {
                    Debug.LogError("❌ Error al parsear JSON: " + ex.Message);
                }
            }
            else
            {
                Debug.LogError("❌ No se ingresó ningún JSON.");
            }
        }
    }

    void GenerateQuestions(GameQuestionEntry[] entries)
    {
        Directory.CreateDirectory(basePath);

        for (int i = 0; i < entries.Length; i++)
        {
            var entry = entries[i];
            var question = CreateOrUpdate<GameQuestion>(basePath, $"Question_{i + 1}");

            question.text = entry.text;
            question.rightText = entry.rightText;
            question.leftText = entry.leftText;
            question.successMessage = entry.successMessage;
            question.errorMessage = entry.errorMessage;
            question.correct = entry.correct;

            EditorUtility.SetDirty(question);
        }

        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();
        Debug.Log("✅ Preguntas generadas correctamente desde JSON.");
    }

    T CreateOrUpdate<T>(string folder, string name) where T : ScriptableObject
    {
        string path = Path.Combine(folder, name + ".asset").Replace("\\", "/");
        var obj = AssetDatabase.LoadAssetAtPath<T>(path);
        if (obj == null)
        {
            obj = ScriptableObject.CreateInstance<T>();
            AssetDatabase.CreateAsset(obj, path);
        }
        return obj;
    }

    [System.Serializable]
    private class Wrapper { public GameQuestionEntry[] items; }

    [System.Serializable]
    public class GameQuestionEntry
    {
        public string text;
        public string rightText;
        public string leftText;
        public string successMessage;
        public string errorMessage;
        public bool correct;
    }
}
