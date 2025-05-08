using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class AventuraGraficaScreen : MonoBehaviour
{
    [Header("Referencias de UI")]
    public TalkingText text;
    public GameObject startButton;
    public GameObject option1;
    public GameObject option2;
    public GameObject buttons;
    public Image textboxImage;

    protected AventuraGrafica adventure;

    protected GraphicAdventureData currentData;
    public ButtonRandomizer randomizer;
    public virtual void SetScreen(GraphicAdventureData data, AventuraGrafica controller)
    {
        adventure = controller;
        currentData = data;

        // Asegurar que esté visible y configurado
        gameObject.SetActive(true);
        text.gameObject.SetActive(true);

        startButton.SetActive(false);
        option1.SetActive(false);
        option2.SetActive(false);
        buttons.SetActive(false);

        text.ApplyText(data.mainText);
    }

    public virtual void OnTextFinish()
    {
        buttons.SetActive(true);

        bool hasLeft = !string.IsNullOrEmpty(currentData.leftOption);
        bool hasRight = !string.IsNullOrEmpty(currentData.rightOption);

        if (hasLeft && hasRight)
        {
            option1.SetActive(true);
            option2.SetActive(true);

            option1.GetComponentInChildren<TMP_Text>().text = currentData.leftOption;
            option2.GetComponentInChildren<TMP_Text>().text = currentData.rightOption;
        }
        else
        {
            startButton.SetActive(true);
            TMP_Text startButtonText = startButton.GetComponentInChildren<TMP_Text>();
            if (startButtonText != null)
                startButtonText.text = currentData.rightOption;
        }
    }

    public virtual void Next(bool correct)
    {
        adventure.Next(correct);
    }
}
