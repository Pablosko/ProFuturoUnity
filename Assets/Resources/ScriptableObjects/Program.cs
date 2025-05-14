using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;
using static UnityEngine.GraphicsBuffer;

[CreateAssetMenu(fileName = "Program", menuName = "Scriptable Objects/Program")]
public class Program : ScriptableObject
{
    public string programName;
    [Header("╔═════ HIGH SCREEN ═════╗\n║                                                      ║\n║                                                      ║\n║                                                      ║\n╚═══════╗      ╔═══════╝")]
    public ComponentsConfiguration hightScreenConfiguration;

    [Header("╔═══════╝      ╚════════╗\n║                                                        ║\n║                                                        ║\n║                                                        ║\n╚═════ LOW SCREEN ══════╝")]
    public ComponentsConfiguration lowScreenConfiguration;
    [HideInInspector]
    public List<Component> components;
    [HideInInspector]
    public List<Component> mainScreenComponents;
    public List<ComputerScreenAsset> screens;
    public List<T> GetAllComponentsOfType<T>() where T : Component
    {
        return components
            .Where(c => c is T)
            .Cast<T>()
            .ToList();
    }
    public List<T> GetAllMainComponentsOfType<T>() where T : Component
    {
        return mainScreenComponents
            .Where(c => c is T)
            .Cast<T>()
            .ToList();
    }
    public bool IsBlocked() 
    {
        foreach (Component component in components)
        {
            if (component.IsBlocked())
                return true;
        }
        foreach (Component component in mainScreenComponents)
        {
            if (component.IsBlocked())
                return true;
        }
        return false;
    }

    public bool CanProgress() 
    {
        foreach (Component component in components)
        {
            if (!component.CanProgress())
                return false;
        }
        foreach (Component component in mainScreenComponents)
        {
            if (!component.CanProgress())
                return false;
        }
        return true;
    }
    public void InitializeProgram(Computer computer)
    {
        components.Clear();
        mainScreenComponents.Clear();
        computer.index = 0;

        ClearChildren(computer.highScreenTransform);
        ClearChildren(computer.lowScreenTransform);

        // Instanciar componentes en lowScreen
        foreach (GameObject prefab in lowScreenConfiguration.components)
        {
            if (prefab != null) 
            {
                Component component = Instantiate(prefab, computer.lowScreenTransform).GetComponent<Component>();
                components.Add(component);
            }
        }
        foreach (GameObject prefab in hightScreenConfiguration.components)
        {
            if (prefab != null)
            {
                Component component = Instantiate(prefab, computer.highScreenTransform).GetComponent<Component>();
                mainScreenComponents.Add(component);
            }
        }
        foreach (Component component in components)
        {
            component.Initialize(computer);
        }
        foreach (Component component in mainScreenComponents)
        {
            component.Initialize(computer);
        }
    }
    private void ClearChildren(Transform parent)
    {
        for (int i = parent.childCount - 1; i >= 0; i--)
        {
            Object.Destroy(parent.GetChild(i).gameObject);
        }
    }
    public void SetComponentsFeedBack(ComputerScreenAsset screen, bool state) 
    {
        foreach (Component component in components)
        {
            if(state)
                component.SetCorrectFeedBack(screen);
            else
                component.SetInCorrectFeedBack(screen);
        }
        foreach (Component component in mainScreenComponents)
        {
            if (state)
                component.SetCorrectFeedBack(screen);
            else
                component.SetInCorrectFeedBack(screen);
        }
        RefreshStates();
    }
    public void RefreshStates()
    {
        foreach (Component component in components)
        {
                component.RefreshState();
        }
        foreach (Component component in mainScreenComponents)
        {
                component.RefreshState();
        }
    }
    public void EndScreen() 
    {
        foreach (Component component in components)
        {
            component.EndScreen();
        }
        foreach (Component component in mainScreenComponents)
        {
            component.EndScreen();
        }
    }
    public void StartScreen()
    {
        foreach (Component component in components)
        {
            component.StartScreen();
        }
        foreach (Component component in mainScreenComponents)
        {
            component.StartScreen();
        }
    }
}
