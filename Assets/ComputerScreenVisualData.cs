using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ComputerScreenVisualData : MonoBehaviour
{
    public Image image;
    public ComputerText autoText;

    public void SetScreenData(ComputerScreenAsset data)
    {
        if (autoText != null) 
        {
            autoText.onEndTyping.RemoveAllListeners();
            autoText.onEndTyping.AddListener(() => { data.cpu.GetCurrentProgram().RefreshStates(); });
            autoText.StartType(data.text,data.cpu);
        }

        if (image != null)
        {
            image.sprite = data.image;
            image.SetNativeSize();
            image.gameObject.SetActive(data.image != null);
        }
    }
    public void SetScreenFeedBackData(ComputerScreenAsset data,bool state)
    {
        if (autoText != null) 
        {
            autoText.onEndTyping.RemoveAllListeners();
            autoText.onEndTyping.AddListener(() => { data.cpu.GetCurrentProgram().RefreshStates(); });
            autoText.StartType(state == true ? data.feedbackCorrectText : data.feedbackIncorrectText,data.cpu);
        }
    }
    public bool EndedText() 
    {
        if (autoText != null)
            return autoText.endType == true;
        else return true;
    }
}