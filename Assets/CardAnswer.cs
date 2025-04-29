using TMPro;
using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class CardAnswer : MonoBehaviour
{
    public TextMeshProUGUI contentText;
    public Image image;

    private RectTransform rectTransform;
    private CanvasGroup canvasGroup;

    private Vector3 initialMousePos;
    private bool isDragging = false;
    private bool selectedRight;

    public float sensitivity = 0.01f;
    public float activationThreshold = 0.3f;
    public float fadeOutTime = 0.5f;

    private GameQuestion question;
    private bool decisionShown = false;
    private bool isFading = false;
    public Sprite correctSprite;
    public Sprite IncorrectSprite;

    public System.Action onDestroyed; // para notificar al controlador (opcional)

    void Awake()
    {
        rectTransform = GetComponent<RectTransform>();
        canvasGroup = GetComponent<CanvasGroup>();
        if (canvasGroup == null)
        {
            canvasGroup = gameObject.AddComponent<CanvasGroup>();
        }
    }

    void Update()
    {
        if (isDragging)
        {
            Vector3 delta = (Input.mousePosition - initialMousePos) * sensitivity;

            // Movimiento libre en X e Y
            rectTransform.anchoredPosition = new Vector2(delta.x * 100f, delta.y * 100f);

            // Rotación estilo Tinder (solo Z)
            rectTransform.localRotation = Quaternion.Euler(0f, 0f, -delta.x * 5f);

            // Mostrar u ocultar texto según umbral
            if (Mathf.Abs(delta.x) > activationThreshold * 10)
            {
                if (!decisionShown)
                {
                    selectedRight = delta.x > 0;
                    contentText.text = selectedRight ? question.rightText : question.leftText;
                    decisionShown = true;
                }
            }
            else
            {
                if (decisionShown)
                {
                    contentText.text = "";
                    decisionShown = false;
                }
            }
        }
    }

    public void BeginDrag()
    {
        isDragging = true;
        initialMousePos = Input.mousePosition;
        decisionShown = false;
        contentText.text = "";
    }

    public void EndDrag()
    {
        isDragging = false;

        Vector3 delta = (Input.mousePosition - initialMousePos) * sensitivity;

        if (Mathf.Abs(delta.x) > activationThreshold)
        {
            selectedRight = delta.x > 0;
            bool isCorrect = selectedRight == question.correct;
            image.sprite = isCorrect ? correctSprite : IncorrectSprite;

            if (!isFading)
                StartCoroutine(FadeOutOnly(isCorrect));
        }
        else
        {
            DestroyImmediately();
        }
    }

    private IEnumerator FadeOutOnly(bool isCorrect)
    {
        isFading = true;

        float elapsed = 0f;
        float duration = fadeOutTime;
        float startAlpha = canvasGroup.alpha;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;

            canvasGroup.alpha = Mathf.Lerp(startAlpha, 0f, t);
            yield return null;
        }

        onDestroyed?.Invoke();
        TinderGame.instance.CompleteSelection(isCorrect);
        Destroy(gameObject);
    }

    private void DestroyImmediately()
    {
        onDestroyed?.Invoke();
        Destroy(gameObject);
    }

    public void SetQuestion(GameQuestion q)
    {
        question = q;
        contentText.text = ""; // el texto se mostrará al pasar umbral
    }
}
