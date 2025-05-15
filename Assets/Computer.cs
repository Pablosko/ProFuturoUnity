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
    public Dictionary<string, string> memoryBlocks = new();
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
    public bool hardcodedNumberOneTime;

    void Start()
    {
        currentProgram = 0;
        StartProgram();
    }

    public void Update()
    {
        if (Input.GetKey(KeyCode.LeftControl))
        {
            if (Input.GetKeyDown(KeyCode.Z)) ChangeProgram(-1);
            if (Input.GetKeyDown(KeyCode.Y)) ChangeProgram(1);
        }
    }

    public Program GetCurrentProgram() => programs[currentProgram];
    public ComputerScreenAsset GetCurrentScreen() => GetCurrentProgram().screens[index];
    public bool HasNext() => index < GetCurrentProgram().screens.Count - 1;
    public bool HasPrev() => index > 0;
    public bool IsEnd() => currentProgram >= programs.Count && !HasNext();
    public bool NeedsInput() => GetCurrentScreen().HasInput;
    public bool CanProgress() => GetCurrentProgram().CanProgress() && !IsEnd() && !IsScreenBlock();
    public bool IsScreenBlock() => GetCurrentProgram().IsBlocked();
    public bool IsInFeedBack(bool state) => upScreenImage.color == (state == true ? correct : incorrect);
    public bool IsInFeedBack() => upScreenImage.color != normal;
    public void SetProgressState(bool state) => canProgress = state;

    public void LoadPrev()
    {
        if (!HasPrev()) return;
        index--;
        RefresScreen();
    }

    public void LoadNext()
    {
        if (IsScreenBlock()) return;

        if (GetCurrentScreen().HasFeedback && upScreenImage.color == normal)
        {
            if (CanProgress())
                SetCorrectFeedBack(GetCurrentScreen());
            else
                SetInCorrectFeedBack(GetCurrentScreen());
            return;
        }

        if (IsInFeedBack(false) && (!CanProgress() || !GetCurrentScreen().HasOptions))
        {
            RefresScreen();
        }

        if (!CanProgress() && !GetCurrentScreen().HasOptions && HasNext())
            return;

        if (index < GetCurrentProgram().screens.Count - 1)
        {
            GetCurrentProgram().EndScreen();
            index++;
            RefreshComponents();
            RefresScreen();
            GetCurrentProgram().StartScreen();
        }
        else if (currentProgram < programs.Count - 1)
        {
            ChangeProgram(1);
        }
        else EndGame();
    }
    public void RefreshComponents() 
    {
        if (GetCurrentScreen().overrideConfiguration != null) 
        {
            GetCurrentProgram().OverrideComponents(false,GetCurrentScreen().overrideConfiguration.components,this);
        }
    }

    public void ChangeProgram(int direction)
    {
        currentProgram += direction;
        currentProgram = Mathf.Clamp(currentProgram, 0, programs.Count - 1);
        StartProgram();
        RefresScreen();
    }

    public void EndGame() => TerminateGame();

    public void RefresScreen()
    {
        SetNormalFeedBack();
        GenerateScreen();
        foreach (Component component in GetCurrentProgram().components)
            component.SetRefreshFeedBack(GetCurrentScreen());

        foreach (Component component in GetCurrentProgram().mainScreenComponents)
            component.SetRefreshFeedBack(GetCurrentScreen());
    }

    public void StartProgram()
    {
        GetCurrentProgram().InitializeProgram(this);
        GenerateScreen();
    }

    public void GenerateScreen()
    {
        foreach (Component component in GetCurrentProgram().components)
            component.SetScreenData(GetCurrentScreen());

        foreach (Component component in GetCurrentProgram().mainScreenComponents)
            component.SetScreenData(GetCurrentScreen());
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
            Invoke(nameof(RefresScreen), 0.5f);
    }

    public void SetNormalFeedBack()
    {
        upScreenImage.color = normal;
        lowScreenImage.color = normal;
    }

    public string GetMemoryRegister(string direction)
    {
        string cleanKey = direction.TrimStart('#').ToLower();
        return memoryBlocks.TryGetValue(cleanKey, out string value) ? value : "";
    }

    public void ApplyMemoryRegister(ref string source, string direction)
    {
        string content = GetMemoryRegister(direction);
        if (!string.IsNullOrEmpty(content))
            source = content;
    }

    public void SetMemoryRegister(string source, string direction)
    {
        string cleanKey = direction.TrimStart('#').ToLower();
        memoryBlocks[cleanKey] = source;
        Debug.Log($"SetMemoryRegister: Guardado en memoryBlocks → clave: '{cleanKey}', valor: '{source}'");
    }

    public string ComputeText(string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            Debug.Log("ComputeText: El texto está vacío o es nulo.");
            return "";
        }

        System.Random rng = new System.Random();
        Debug.Log($"ComputeText: Texto original recibido: \"{text}\"");

        foreach (var pair in memoryBlocks)
            Debug.Log($"MemoryBlock: {pair.Key} => {pair.Value}");

        // #XXXX → registros de memoria
        text = Regex.Replace(text, @"#([A-Za-z0-9]{4})", match =>
        {
            string key = match.Groups[1].Value.ToLower();
            return memoryBlocks.TryGetValue(key, out var value) ? value : match.Value;
        });

        // <upper=N> → pone letra en posición N en mayúsculas
        text = Regex.Replace(text, @"<upper=(-?\d+)>", match =>
        {
            int index = int.Parse(match.Groups[1].Value);
            int realIndex = index >= 0 ? index - 1 : text.Length + index;
            if (realIndex >= 0 && realIndex < text.Length)
                text = text.Remove(realIndex, 1).Insert(realIndex, char.ToUpper(text[realIndex]).ToString());
            return "";
        });

        // <add='number',N> → inserta N números aleatorios
        text = Regex.Replace(text, @"<add='number',(\d+)>", match =>
        {
            int count = int.Parse(match.Groups[1].Value);
            for (int i = 0; i < count; i++)
            {
                int pos = rng.Next(0, text.Length + 1);
                char digit = (char)('0' + rng.Next(10));
                text = text.Insert(pos, digit.ToString());
            }
            return "";
        });

        // <special=N> → añade N símbolos especiales al final
        text = Regex.Replace(text, @"<special=(\d+)>", match =>
        {
            int count = int.Parse(match.Groups[1].Value);
            char[] specials = { '@', '#', '$', '%', '&' };
            for (int i = 0; i < count; i++)
                text += specials[rng.Next(specials.Length)];
            return "";
        });

        Debug.Log($"ComputeText: Resultado final tras parseo: \"{text}\"");
        return text;
    }
}
