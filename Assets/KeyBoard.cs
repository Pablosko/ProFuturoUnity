using System.Collections.Generic;
using UnityEngine;
using TMPro;


#if UNITY_EDITOR
using UnityEditor;
#endif
[ExecuteAlways]
public class KeyBoard : InputComponent
{
    public List<string> keys = new();
    public GameObject keyPrefab;
    public override void Start()
    {
        base.Start();
        ResetAll();
    }

    public override void Initialize(Computer computer)
    {
        base.Initialize(computer);
    }

    public override void SetScreenData(ComputerScreenAsset screenData)
    {
        base.SetScreenData(screenData);
        ResetAll();

    }
    public void ResetAll()
    {
        SetKeyState(inputData.IsValid);
        currentInput = "";
    }
    public override void Update()
    {
        base.Update();
    }

    public void SetKeyState(bool state)
    {
        foreach (Transform child in transform)
        {
            Key key = child.GetComponent<Key>();
            if (key != null)
            {
                if(key.button.interactable != state)
                key.SetInteractable(state);
                if(key.input == null)
                key.input = this;
            }
        }
    }

#if UNITY_EDITOR
    private List<string> previousKeys = new();
    private void OnValidate()
    {
        if (Application.isPlaying || keyPrefab == null) return;

        // Deep copy para evitar referencias compartidas
        if (!AreListsEqual(keys, previousKeys))
        {
            previousKeys = new List<string>(keys);
            EditorApplication.delayCall += () =>
            {
                if (this != null && !Application.isPlaying)
                    SyncKeys();
            };
        }
    }

    private bool AreListsEqual(List<string> a, List<string> b)
    {
        if (a.Count != b.Count) return false;
        for (int i = 0; i < a.Count; i++)
        {
            if (a[i] != b[i]) return false;
        }
        return true;
    }

    private void SyncKeys()
    {
        if (this == null || keyPrefab == null) return;

        // Recoger hijos actuales
        List<GameObject> children = new();
        foreach (Transform child in transform)
        {
            if (child.GetComponent<Key>() != null)
                children.Add(child.gameObject);
        }

        // Crear/Actualizar claves
        for (int i = 0; i < keys.Count; i++)
        {
            string keyText = keys[i];
            GameObject instance;

            if (i < children.Count)
            {
                instance = children[i];
            }
            else
            {
                instance = (GameObject)PrefabUtility.InstantiatePrefab(keyPrefab);
                Undo.RegisterCreatedObjectUndo(instance, "Add Key");
                instance.transform.SetParent(transform, false);
            }

            instance.name = $"Key_{keyText}_{i}";
            var key = instance.GetComponent<Key>();
            key?.SetData(keyText);
            key.input = this;
        }

        // Eliminar sobrantes
        for (int i = keys.Count; i < children.Count; i++)
        {
            GameObject extra = children[i];

            if (PrefabUtility.IsPartOfPrefabInstance(extra))
            {
                PrefabUtility.UnpackPrefabInstance(extra, PrefabUnpackMode.Completely, InteractionMode.AutomatedAction);
            }

            Undo.DestroyObjectImmediate(extra);
        }
    }
 
#endif
}
