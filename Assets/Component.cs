using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Device;

public class Component : MonoBehaviour
{
    [HideInInspector]
    public Computer cpu;
    public virtual void Start()
    {
        RefreshState();
    }

    public virtual void Initialize(Computer computer)
    {
        cpu = computer;
    }
    public virtual void SetScreenData(ComputerScreenAsset screenData)
    {
        RefreshState();
    }
    public virtual void SetCorrectFeedBack(ComputerScreenAsset screenData)
    {

    }
    public virtual void SetInCorrectFeedBack(ComputerScreenAsset screenData)
    {

    }
    public virtual void SetRefreshFeedBack(ComputerScreenAsset screenData)
    {
        RefreshState();
    }
    public virtual bool CanProgress() 
    {
        return true;
    }
    public virtual bool IsBlocked()
    {
        return false;
    }
    public virtual bool IsActive() 
    {
        return true;
    }
    public virtual void StartScreen()
    {
    }
    public virtual void EndScreen()
    {
    }
    public virtual void RefreshState() 
    {
        gameObject.SetActive(IsActive());
    }
}
public class ScreenComponent : Component
{
    public TextMeshProUGUI text;
    public override void Start()
    {
        base.Start();
    }
    public override void Initialize(Computer computer)
    {
        base.Initialize(computer);
        text.text = "";
    }
    public override void SetScreenData(ComputerScreenAsset screenData)
    {
        base.SetScreenData(screenData);
    }
    public void SetData(string data) 
    {
        text.text = data;
    }
}
public class InputComponent : Component
{
    [HideInInspector]
    public List<ScreenComponent> screens;
    [HideInInspector]
    public string currentInput;
    [HideInInspector]
    public InputData inputData;
    private Coroutine blinkCoroutine;
    public override void Start()
    {
        base.Start();
    }
    public override void Initialize(Computer computer)
    {
        base.Initialize(computer);
        screens = computer.GetCurrentProgram().GetAllComponentsOfType<ScreenComponent>();
    }
    public override void SetScreenData(ComputerScreenAsset screenData)
    {
        base.SetScreenData(screenData);
        inputData = screenData.inputData;
        AddDataToScreen("");

    }
   public virtual void Update()
    {
        if (inputData.CanType(currentInput, cpu) && blinkCoroutine == null)
        {
            blinkCoroutine = StartCoroutine(BlinkCursor());
        }
        else if (!inputData.CanType(currentInput, cpu) && blinkCoroutine != null)
        {
            StopCoroutine(blinkCoroutine);
            blinkCoroutine = null;
            inputData.RemoveInputEffect();
        }
        else if(inputData.typeEffect != "" && !inputData.CanType(currentInput, cpu))
        {
            inputData.typeEffect = "";
            RefreshScreen();
        }
    }
    private IEnumerator BlinkCursor()
    {
        while (true)
        {
            inputData.SetInputEffect();
            RefreshScreen();
            yield return new WaitForSeconds(0.3f);
            inputData.RemoveInputEffect();
            RefreshScreen();
            yield return new WaitForSeconds(0.3f);
        }
    }

    public override bool CanProgress()
    {
        return base.CanProgress() && IsInputCorrect();
    }
    public void AddDataToScreen(string data) 
    {
        foreach (ScreenComponent screen in screens)
        {
            if (data == "")
                currentInput = "";
            if(inputData.capped && !inputData.MatchLength(currentInput, cpu))
             currentInput += data;

            screen.SetData(inputData.GetDisplayInput(this));
        }
    }
    public void SetDataToScreen(string data)
    {
        foreach (ScreenComponent screen in screens)
        {
            if (inputData.capped && !inputData.MatchLength(data, cpu))
                currentInput = data;

            screen.SetData(inputData.GetDisplayInput(this));
        }
    }
    public void RefreshScreen() 
    {
        foreach (ScreenComponent screen in screens)
        {
            screen.SetData(inputData.GetDisplayInput(this));
        }
    }
    public override void EndScreen()
    {
        base.EndScreen();
        inputData.SaveRegisters(this);
    }
    public override void StartScreen()
    {
        base.EndScreen();
        inputData.ApplyRegisters(this);
    }
    public virtual bool IsInputCorrect()
    {
        return inputData.Matches(currentInput, cpu);
    }
    public override bool IsActive()
    {
        return inputData.IsValid && !cpu.IsInFeedBack();
    }
}

