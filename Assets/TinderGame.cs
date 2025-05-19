using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
public class TinderGame : Game
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

    [TextArea(3,5)]
    public string endCorrectText;
    [TextArea(3, 5)]
    public string endinCorrectText;

    private void Awake()
    {
        instance = this;

        // Cargar preguntas desde Resources
        questions = new List<GameQuestion>(Resources.LoadAll<GameQuestion>("ScriptableObjects/Games/SelectionGame/" + stageGame));
        Debug.Log($"Cargadas {questions.Count} preguntas.");
    }
    public void Update()
    {
        if (Input.GetKey(KeyCode.LeftControl))
        {
            if (Input.GetKeyDown(KeyCode.S))
            {
                correctAnswers = 10;
                EndGame();
            }
        }
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
        AudioManager.instance.PlayMusic(AudioManager.instance.minigameBg, 0.3f);
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
            questions[i].Shuffle();
            questions[randomIndex] = temp;
        }
    }

    GameQuestion GetCurrentQuestion()
    {
        return questions[currentRound - 1];
    }

    public void NextCard()
    {
        feedBackMessage.gameObject.SetActive(false);
        currentRound++;
        if (currentRound > totalRounds || currentRound > questions.Count)
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
        cardTransform.gameObject.SetActive(true);
        UpdateRoundsText();
    }

    void UpdateRoundsText()
    {
        questionCounterText.text = $"{currentRound}/{totalRounds}";
        UpdateProgress();
    }
    void UpdateProgress() 
    {
        float progress = (float)currentRound / totalRounds;
        progressBar.fillAmount = progress;
    }

    public void CompleteSelection(bool correct)
    {
        if (correct)
        {
            correctAnswers++;
            UpdateRoundsText();
            AudioManager.instance.PlaySFX(AudioManager.instance.minigameFbOk);
            OpenFeedBack(true, GetCurrentQuestion().successMessage, MessageType.NextCard);
        }
        else 
        {
            AudioManager.instance.PlaySFX(AudioManager.instance.minigameFbKo);
            OpenFeedBack(false, GetCurrentQuestion().errorMessage, MessageType.NextCard); 
        }
    }

    void EndGame()
    {
        UpdateRoundsText();
        float ratio = (float)correctAnswers / totalRounds;
        Debug.Log($"Juego terminado. Ratio: {ratio}");
        cardTransform.gameObject.SetActive(false);
        maingameobject.SetActive(false);
        if (ratio >= successThreshold)
        {
            endFeedBackcorrect.SetActive(true);
            correctText.text = $"{correctAnswers}/{totalRounds}";
            endFeedBackIncorrect.SetActive(false);
            AudioManager.instance.PlaySFX(AudioManager.instance.storytellingFbOk);

        }
        else
        {
            endFeedBackcorrect.SetActive(false);
            endFeedBackIncorrect.SetActive(true);
            incorrectText.text = $"{correctAnswers}/{totalRounds}";
            AudioManager.instance.PlaySFX(AudioManager.instance.storytellingFbKo);
        }
    }
    public void OpenFeedBack(bool correct, string message, MessageType type)
    {
        cardTransform.gameObject.SetActive(false);
        feedBackMessage.gameObject.SetActive(true);
        feedBackMessage.SetData(correct, message, type);
    }

    public  void playDragSound()
    {
        AudioManager.instance.PlaySFX(AudioManager.instance.minigameCardSlide);
    }
}
public class Game : MonoBehaviour 
{
    public int stageGame;
    public string id;   
    protected bool paused;
    public virtual void Start()
    {
        SCORMManager.instance.InitPage(id);
    }
    public void TerminateGame()
    {
        AudioManager.instance.PlaySFX(AudioManager.instance.nextBtn);
        SCORMManager.instance.EndPage(id);
        Destroy(gameObject);
        Home.instance.gameObject.SetActive(true);
        Home.instance.StartStage(stageGame+ 1);
        Home.instance.CompleteStage(stageGame);
    }

}