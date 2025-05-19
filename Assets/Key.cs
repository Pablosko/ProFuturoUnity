using TMPro;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Windows;

public class Key : MonoBehaviour
{
    public TextMeshProUGUI text;
    public Button button;
    public InputComponent input;

    public void SetData(string content)
    {
        text.text = content;
    }


    public void SetInteractable(bool state)
    {
        if (button == null) return;
        button.interactable = state;
    }
    public void Click() 
    {
            input.TriggerSoundEffect();
        button.interactable = false;
        input.AddDataToScreen(text.text);
    }
}
