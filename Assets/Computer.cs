using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Text.RegularExpressions;

[System.Serializable]
public struct ScreenData
{
    public GameObject prefab;
    [TextArea(3, 5)]
    public string text;
    public InputData inputData;
    public Sprite image;

    public bool hasInput() 
    {
        return inputData.IsValid;
    }
    public bool HasFeedBack() 
    {
        return true;
    }
}



public class Computer : Game
{
    public List<Program> programs;
    public Dictionary<string,string> memoryBlocks = new();
    public GameObject correctFeedBack;
    public GameObject correctFeedBackNoText;
    public GameObject incorrectFeedBack;
    public GameObject incorrectFeedBackNoText;
    public Transform highScreenTransform;
    public Transform lowScreenTransform;
    public Image upScreenImage;
    public Image lowScreenImage;
    public Color correct;
    public Color incorrect;
    public Color normal;


    [HideInInspector] public int index;
    int currentProgram;
    bool canProgress;

    void Start()
    {
        currentProgram = 0;
        StartProgram();
    }
    public void Update()
    {
        if (Input.GetKey(KeyCode.LeftControl))
        {
            if (Input.GetKeyDown(KeyCode.Z))
            {
                ChangeProgram(-1);
            }

            if (Input.GetKeyDown(KeyCode.Y))
            {
                ChangeProgram(1);
            }

        }
    }
    public Program GetCurrentProgram() => programs[currentProgram];

    public ComputerScreenAsset GetCurrentScreen() => GetCurrentProgram().screens[index];

    public bool HasNext() => index < GetCurrentProgram().screens.Count - 1;
    public bool HasPrev() => index > 0;

    public bool IsEnd()
    {
        return currentProgram >= programs.Count && !HasNext();
    }

    public bool NeedsInput()
    {
        return GetCurrentScreen().HasInput;
    }
    public bool CanProgress()
    {
        return GetCurrentProgram().CanProgress() && !IsEnd() && !IsScreenBlock();
    }
    public bool IsScreenBlock()
    {
        return GetCurrentProgram().IsBlocked();
    }

    public void SetProgressState(bool state) => canProgress = state;
    public void LoadPrev()
    {
        if (!HasPrev()) return;

        index--;
        RefresScreen();
    }
    public void LoadNext()
    {
        if (IsScreenBlock())
            return;

        if (GetCurrentScreen().HasFeedback && upScreenImage.color == normal)
        {
            if (CanProgress())
                SetCorrectFeedBack(GetCurrentScreen());
            else
                SetInCorrectFeedBack(GetCurrentScreen());
            return;
        }
        if (IsInFeedBack() && (!CanProgress() || !GetCurrentScreen().HasOptions))
        {
            RefresScreen();
        }
        bool canProgress = CanProgress();
        bool hasOptions = GetCurrentScreen().HasOptions;

        if (!canProgress && !hasOptions && HasNext())
        {
            return;
        }

        if (index < GetCurrentProgram().screens.Count - 1)
        {
            GetCurrentProgram().EndScreen();
            index++;
            RefresScreen();
            GetCurrentProgram().StartScreen();
        }
        else if (currentProgram < programs.Count - 1)
        {
            ChangeProgram(1);
        }
        else
            EndGame();
    }
    public bool IsInFeedBack() 
    {
        return upScreenImage.color != normal;
    }
    public void ChangeProgram(int direction) 
    {
        currentProgram += direction;
        currentProgram = Mathf.Clamp(currentProgram, 0, programs.Count - 1);
        StartProgram();
        RefresScreen();
    }
    public void EndGame() 
    {
        TerminateGame();
    }
    public void RefresScreen() 
    {
        SetNormalFeedBack();
        GenerateScreen();
        foreach (Component component in GetCurrentProgram().components)
        {
            component.SetRefreshFeedBack((GetCurrentScreen()));
        }
        foreach (Component component in GetCurrentProgram().mainScreenComponents)
        {
            component.SetRefreshFeedBack((GetCurrentScreen()));
        }
    }
    

    public void StartProgram()
    {
        GetCurrentProgram().InitializeProgram(this);
        GenerateScreen();
    }

    public void GenerateScreen()
    {
        foreach (Component component in GetCurrentProgram().components)
        {
            component.SetScreenData((GetCurrentScreen()));
        }
        foreach (Component component in GetCurrentProgram().mainScreenComponents)
        {
            component.SetScreenData((GetCurrentScreen()));
        }
    }

    public void SetCorrectFeedBack(ComputerScreenAsset screenData)
    {
        upScreenImage.color = correct;
        lowScreenImage.color = correct;
        GetCurrentProgram().SetComponentsFeedBack(screenData, true);
    }
    public void SetInCorrectFeedBack(ComputerScreenAsset screenData)
    {
        upScreenImage.color = incorrect;
        lowScreenImage.color = incorrect;
        GetCurrentProgram().SetComponentsFeedBack(screenData, false);
        if (screenData.temporalFeedBack)
            Invoke("RefresScreen", 0.5f);

    }
    public void SetNormalFeedBack() 
    {
        upScreenImage.color = normal;
        lowScreenImage.color = normal;
    }
    public string GetMemoryRegister(string direction) 
    {
        if (memoryBlocks.ContainsKey(direction))
            return memoryBlocks[direction];
        return "";
    }
    public void ApplyMemoryRegister(ref string source, string direction) 
    {
        string content = GetMemoryRegister(direction);
        if (!string.IsNullOrEmpty(content))
        {
            source = content;
        }
    }
    public void SetMemoryRegister(string source, string direction)
    {
        memoryBlocks[direction] = source;
    }
    public string ComputeText(string text)
    {
        if (string.IsNullOrEmpty(text))
            return "";

        // Expresión regular para encontrar patrones como #A1B2
        return Regex.Replace(text, @"#([A-Za-z0-9]{4})", match =>
        {
            string key = match.Groups[1].Value; // Extrae el valor sin el "#"
            if (memoryBlocks.TryGetValue(key, out string value))
            {
                return value;
            }
            return match.Value; // Si no se encuentra, devuelve el original (con #)
        });
    }
}
