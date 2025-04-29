using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class TinderGame : MonoBehaviour
{
    public List<GameQuestion> questions;
    public GameObject cardPerfab;
    public Transform cardTransform;
    public Transform lerpTransform;
    public GameCard currentCard;

    public int totalRounds = 5;
    public float successThreshold = 0.6f; // ej: 60% correctas requeridas

    private int currentRound = 0;
    private int correctAnswers = 0;

    [Header("UI")]
    public Image progressBar; // Fill image
    public TextMeshProUGUI questionCounterText; // "2/5"

    public static TinderGame instance;
    public FeedBackMessage feedBackMessage;
    public Image backgroundImage;
    public Sprite defaultSpriteBackground;
    public GameObject maingameobject;
    public GameObject endFeedBackcorrect;
    public GameObject endFeedBackIncorrect;
    public GameObject unlockedMedal;
    public TextMeshProUGUI correctText;
    public TextMeshProUGUI incorrectText;

    private void Awake()
    {
        instance = this;

        // Cargar preguntas desde Resources
        questions = new List<GameQuestion>(Resources.LoadAll<GameQuestion>("ScriptableObjects/Games/SelectionGame"));
        Debug.Log($"Cargadas {questions.Count} preguntas.");
    }

    void OnEnable()
    {
        InitGame();
    }
   
    public void InitGame()
    {
        maingameobject.SetActive(true);
        currentRound = 0;
        correctAnswers = 0;

        ShuffleQuestions();
        NextCard();
        UpdateProgress();
        UpdateRoundsText();
    }

    void ShuffleQuestions()
    {
        for (int i = 0; i < questions.Count; i++)
        {
            var temp = questions[i];
            int randomIndex = Random.Range(i, questions.Count);
            questions[i] = questions[randomIndex];
            questions[randomIndex] = temp;
        }
    }

    GameQuestion GetCurrentQuestion()
    {
        return questions[currentRound];
    }

    public void NextCard()
    {
        feedBackMessage.gameObject.SetActive(false);
        if (currentRound >= totalRounds || currentRound >= questions.Count)
        {
            EndGame();
            return;
        }
        backgroundImage.sprite = defaultSpriteBackground;
        GameQuestion question = GetCurrentQuestion();
        if (currentCard != null)
            Destroy(currentCard.gameObject);
        currentCard = Instantiate(cardPerfab, cardTransform).GetComponent<GameCard>();
        currentCard.SetData(question, cardTransform.GetComponent<RectTransform>(), lerpTransform);
        currentRound++;
        if (currentRound >= questions.Count)
        {
            EndGame();
            return;
        }
        cardTransform.gameObject.SetActive(true);
        UpdateRoundsText();
    }

    void UpdateRoundsText()
    {
        questionCounterText.text = $"{correctAnswers}/{totalRounds}";
    }
    void UpdateProgress() 
    {
        float progress = (float)correctAnswers / totalRounds;
        progressBar.fillAmount = progress;
    }

    public void CompleteSelection(bool correct)
    {
        if (correct)
        {
            correctAnswers++;
            UpdateRoundsText();
            OpenFeedBack(true,GetCurrentQuestion().successMessage,MessageType.NextCard);
        }else
            OpenFeedBack(false, GetCurrentQuestion().errorMessage, MessageType.NextCard); 
    }

    void EndGame()
    {
        float ratio = (float)correctAnswers / totalRounds;
        Debug.Log($"Juego terminado. Ratio: {ratio}");
        cardTransform.gameObject.SetActive(false);
        maingameobject.SetActive(false);
        if (ratio >= successThreshold)
        {
            endFeedBackcorrect.SetActive(true);
            correctText.text = $"{correctAnswers}/{totalRounds}";

        }
        else
        {
            endFeedBackIncorrect.SetActive(true);
            incorrectText.text = $"{correctAnswers}/{totalRounds}";
        }
    }
    public void OpenFeedBack(bool correct, string message, MessageType type)
    {
        cardTransform.gameObject.SetActive(false);
        feedBackMessage.gameObject.SetActive(true);
        feedBackMessage.SetData(correct, message, type);
    }
    public void TerminateGame() 
    {
        Destroy(gameObject);
        Home.instance.gameObject.SetActive(true);
        Home.instance.StartStage(2);
    }
}
