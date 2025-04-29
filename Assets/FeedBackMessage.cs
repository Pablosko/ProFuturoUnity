using TMPro;
using UnityEngine;
using UnityEngine.UI;
public enum MessageType 
{
    NextCard,GeniallyNext,Restart
}
public class FeedBackMessage : MonoBehaviour
{
    public Image backgroundImage;
    public Sprite correctBackground;
    public Sprite inCorrectBackground;
    public TextMeshProUGUI contentText;

    public GameObject restartButton;
    public GameObject nextGeniallyButton;
    public GameObject nextCardButton;

    public void SetData(bool correct,string content,MessageType type) 
    {
        contentText.text = content;
        backgroundImage.sprite = correct == true ? correctBackground : inCorrectBackground;
        switch (type)
        {
            case MessageType.NextCard:
                NextCardButton();
                break;
            case MessageType.GeniallyNext:
                NextGenially();
                break;
            case MessageType.Restart:
                RestartButton();
                break;
            default:
                NextCardButton();
                break;
        }
    }
    public void NextCard() 
    {
        TinderGame.instance.NextCard();

    }
    public void RestartButton() 
    {
        nextGeniallyButton?.SetActive(false);
        nextCardButton?.SetActive(false);
        restartButton?.SetActive(true);
    }
    public void NextGenially() 
    {
        nextGeniallyButton?.SetActive(true);
        nextCardButton?.SetActive(false);
        restartButton?.SetActive(false);
    }
    public void NextCardButton()
    {
        nextGeniallyButton?.SetActive(false);
        nextCardButton?.SetActive(true);
        restartButton?.SetActive(false);
    }
}
