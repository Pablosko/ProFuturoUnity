using System;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class ComputerButtonComponent : Component
{
    public string incorrectText;
    public string normalText;
    public TextMeshProUGUI text;
    public override void Start()
    {
        base.Start();
    }
    public override void Initialize(Computer computer)
    {
        base.Initialize(computer);
        cpu = computer;
        text.text = normalText;
    }

    public override void SetScreenData(ComputerScreenAsset screenData)
    {
        base.SetScreenData(screenData);
        text.text = normalText;
    }
    public override void SetInCorrectFeedBack(ComputerScreenAsset screenData)
    {
        base.SetInCorrectFeedBack(screenData);
        text.text = incorrectText;
    }
    public override void SetCorrectFeedBack(ComputerScreenAsset screenData)
    {
        base.SetCorrectFeedBack(screenData);
        text.text = normalText;
    }


    public void SendDataToComputer()
    {
        cpu.LoadNext();
    }
    public override void SetRefreshFeedBack(ComputerScreenAsset screenData)
    {
        base.SetRefreshFeedBack(screenData);
        text.text = normalText;

    }
    public override bool IsActive()
    {
        return base.IsActive() && cpu.NeedsInput() && !cpu.IsInFeedBack();
    }
}