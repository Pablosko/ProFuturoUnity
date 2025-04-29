using UnityEditor;
using UnityEngine;
using System.IO;
using System.Collections.Generic;

public class GraphicAdventureCreator : EditorWindow
{
    private string adventureName = "AventuraTest";
    private string jsonInput = "";
    private string jsonFilePath = "";
    private int screenCount = 1;
    private string basePath = "Assets/Resources/ScriptableObjects/AventuraGrafica";

    private static readonly string[] defaultScreenButtons =
    {
        "¡Perfecto!", "Entendido", "Vamos", "Adelante", "Continuar", "Siguiente"
    };

    [MenuItem("Tools/Crear Aventura Gráfica")]
    public static void ShowWindow()
    {
        GetWindow<GraphicAdventureCreator>("Crear Aventura Gráfica");
    }

    void OnGUI()
    {
        GUILayout.Label("Configuración", EditorStyles.boldLabel);
        adventureName = EditorGUILayout.TextField("Nombre de la Aventura", adventureName);
        screenCount = EditorGUILayout.IntField("Pantallas (si no hay JSON)", screenCount);

        GUILayout.Space(10);
        GUILayout.Label("Archivo JSON", EditorStyles.boldLabel);

        if (GUILayout.Button("Seleccionar archivo JSON..."))
        {
            jsonFilePath = EditorUtility.OpenFilePanel("Seleccionar archivo JSON", "", "json");
            if (!string.IsNullOrEmpty(jsonFilePath))
            {
                jsonInput = File.ReadAllText(jsonFilePath);
                SetAdventureNameFromFile(jsonFilePath);
            }
        }

        GUILayout.Space(5);
        GUILayout.Label("O arrastra el archivo aquí:", EditorStyles.boldLabel);
        Rect dropArea = GUILayoutUtility.GetRect(0.0f, 50.0f, GUILayout.ExpandWidth(true));
        GUI.Box(dropArea, "Suelta aquí tu archivo .json", EditorStyles.helpBox);

        Event evt = Event.current;
        if ((evt.type == EventType.DragUpdated || evt.type == EventType.DragPerform) && dropArea.Contains(evt.mousePosition))
        {
            DragAndDrop.visualMode = DragAndDropVisualMode.Copy;

            if (evt.type == EventType.DragPerform)
            {
                DragAndDrop.AcceptDrag();
                foreach (string path in DragAndDrop.paths)
                {
                    if (Path.GetExtension(path).ToLower() == ".json")
                    {
                        jsonFilePath = path;
                        jsonInput = File.ReadAllText(jsonFilePath);
                        SetAdventureNameFromFile(path);
                        GUI.FocusControl(null);
                        Debug.Log("✅ JSON cargado desde archivo: " + jsonFilePath);
                        break;
                    }
                }
            }
            evt.Use();
        }

        GUILayout.Space(10);
        GUILayout.Label("Contenido JSON directo (opcional):");
        jsonInput = EditorGUILayout.TextArea(jsonInput, GUILayout.Height(150));

        if (GUILayout.Button("Generar Aventura"))
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

                    GenerateFromJson(wrapper.items);
                }
                catch (System.Exception ex)
                {
                    Debug.LogError("❌ Error al parsear JSON: " + ex.Message);
                }
            }
            else
            {
                Debug.LogError("❌ No se ingresó JSON ni cantidad de pantallas.");
            }
        }
    }

    void SetAdventureNameFromFile(string path)
    {
        string fileName = Path.GetFileNameWithoutExtension(path);
        int underscoreIndex = fileName.IndexOf('_');
        adventureName = underscoreIndex > 0 ? fileName.Substring(0, underscoreIndex) : fileName;
    }

    void GenerateFromJson(AdventureEntry[] entries)
    {
        Dictionary<int, GraphicAdventureData> allScreens = new Dictionary<int, GraphicAdventureData>();
        Dictionary<int, GraphicAdventureData> corrects = new Dictionary<int, GraphicAdventureData>();
        Dictionary<int, GraphicAdventureData> fails = new Dictionary<int, GraphicAdventureData>();

        for (int i = 0; i < entries.Length; i++)
        {
            int index = i + 1;
            string folder = Path.Combine(basePath, adventureName, index.ToString());
            Directory.CreateDirectory(folder);

            var entry = entries[i];
            bool hasOptions = !string.IsNullOrEmpty(entry.leftOption) && !string.IsNullOrEmpty(entry.rightOption);
            GraphicAdventureData screen = null;

            if (entry.hasScreen)
            {
                screen = CreateOrUpdate<GraphicAdventureData>(folder, $"{adventureName}_{index}_Screen");
                screen.mainText = string.IsNullOrWhiteSpace(entry.screenText) ? $"{entry.question}\n\n{entry.description}" : entry.screenText;
                screen.rightOption = string.IsNullOrEmpty(entry.screenButtonText) ? GetRandomScreenButton() : entry.screenButtonText;
                EditorUtility.SetDirty(screen);
                AssetDatabase.SaveAssets();
                allScreens[index] = screen;
            }

            if (hasOptions)
            {
                var selection = CreateOrUpdate<GraphicAdventureData>(folder, $"{adventureName}_{index}_Selection");
                var correct = CreateOrUpdate<GraphicAdventureData>(folder, $"{adventureName}_{index}_Correct");
                var fail = CreateOrUpdate<GraphicAdventureData>(folder, $"{adventureName}_{index}_Fail");

                selection.mainText = entry.question;
                selection.leftOption = entry.leftOption;
                selection.rightOption = entry.rightOption;
                selection.rigthCorrect = entry.rightIsCorrect;
                selection.feedbackCorrect = correct;
                selection.feedbackIncorrect = fail;

                correct.mainText = $"{entry.feedbackCorrect.title}\n{entry.feedbackCorrect.text}\n\n{entry.feedbackCorrect.detail}";
                correct.rightOption = GetRandomScreenButton();

                fail.mainText = $"{entry.feedbackIncorrect.title}\n{entry.feedbackIncorrect.text}\n\n{entry.feedbackIncorrect.detail}";
                fail.rightOption = GetRandomScreenButton();

                if (screen != null)
                {
                    screen.feedbackCorrect = selection;
                    EditorUtility.SetDirty(screen);
                }

                EditorUtility.SetDirty(selection);
                EditorUtility.SetDirty(correct);
                EditorUtility.SetDirty(fail);

                AssetDatabase.SaveAssets();
                allScreens[index] = screen ?? selection;
                corrects[index] = correct;
                fails[index] = fail;
            }
        }

        // Segunda pasada para conectar cada correct/fail con la siguiente pantalla si existe
        for (int i = 0; i < entries.Length - 1; i++)
        {
            int current = i + 1;
            int next = current + 1;

            if (allScreens.ContainsKey(next))
            {
                if (corrects.TryGetValue(current, out var correct))
                {
                    correct.feedbackCorrect = allScreens[next];
                    EditorUtility.SetDirty(correct);
                }

                if (fails.TryGetValue(current, out var fail))
                {
                    fail.feedbackCorrect = allScreens[next];
                    EditorUtility.SetDirty(fail);
                }
            }

            // También aplica para pantallas sin opciones
            if (allScreens.ContainsKey(current) && allScreens.ContainsKey(next))
            {
                var screen = allScreens[current];
                if (string.IsNullOrEmpty(entries[i].leftOption) && string.IsNullOrEmpty(entries[i].rightOption))
                {
                    screen.feedbackCorrect = allScreens[next];
                    EditorUtility.SetDirty(screen);
                }
            }
        }

        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();
        Debug.Log("✅ Aventura generada correctamente desde JSON.");
    }


    static string GetRandomScreenButton()
    {
        return defaultScreenButtons[Random.Range(0, defaultScreenButtons.Length)];
    }

    T CreateOrUpdate<T>(string folder, string name) where T : ScriptableObject
    {
        string path = Path.Combine(folder, $"{name}.asset").Replace("\\", "/");
        var obj = AssetDatabase.LoadAssetAtPath<T>(path);
        if (obj == null)
        {
            obj = ScriptableObject.CreateInstance<T>();
            AssetDatabase.CreateAsset(obj, path);
        }
        return obj;
    }

    [System.Serializable]
    private class Wrapper { public AdventureEntry[] items; }
}

[System.Serializable]
public class AdventureEntry
{
    public string id;
    public bool hasScreen;
    public string screenText;
    public string screenButtonText;
    public string question;
    public string description;
    public string leftOption;
    public string rightOption;
    public bool rightIsCorrect;
    public Feedback feedbackCorrect;
    public Feedback feedbackIncorrect;
}

[System.Serializable]
public class Feedback
{
    public string title;
    public string text;
    public string detail;
}