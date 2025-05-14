using System.Security.Cryptography;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;

public class ComputerMainScreen : Component
{
    public GameObject instanciated;
    public Transform visualTransform;

    public override void SetScreenData(ComputerScreenAsset data)
    {
        data.cpu = cpu;
        if (instanciated != null)
            Destroy(instanciated);
        instanciated = Instantiate(data.screenPrefab, visualTransform);
        instanciated.GetComponent<ComputerScreenVisualData>().SetScreenData(data);
    }
    public override bool CanProgress()
    {
        if(instanciated == null)
            return base.CanProgress();
        else
            return base.CanProgress() && instanciated.GetComponent<ComputerScreenVisualData>().EndedText();

    }
    public override void SetCorrectFeedBack(ComputerScreenAsset screenData)
    {
        screenData.cpu = cpu;
        if (instanciated != null)
            Destroy(instanciated);
        if (screenData.feedbackCorrectText == "")
            instanciated = Instantiate(cpu.correctFeedBackNoText, visualTransform);
        else
            instanciated = Instantiate(cpu.correctFeedBack, visualTransform);
        instanciated.GetComponent<ComputerScreenVisualData>().SetScreenFeedBackData(screenData, true);

    }
    public override void SetInCorrectFeedBack(ComputerScreenAsset screenData)
    {
        screenData.cpu = cpu;
        if (instanciated != null)
            Destroy(instanciated);
  
        if (screenData.feedbackIncorrectText == "")
            instanciated = Instantiate(cpu.incorrectFeedBackNoText, visualTransform);
        else
            instanciated = Instantiate(cpu.incorrectFeedBack, visualTransform);
        instanciated.GetComponent<ComputerScreenVisualData>().SetScreenFeedBackData(screenData, false);
    }
}

