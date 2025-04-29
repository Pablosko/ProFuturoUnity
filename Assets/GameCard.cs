using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;

public class GameCard : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    public GameObject cardAnswerPrefab;
    public RectTransform cardTransform;
    public Transform rightLerpTransform;
    public GameQuestion question;
    public TextMeshProUGUI questionText;

    private CardAnswer cardAnswerInstance;

    public void SetData(GameQuestion q, RectTransform _cardTransform, Transform _rightLerpTransform)
    {
        question = q;
        cardTransform = _cardTransform;
        rightLerpTransform = _rightLerpTransform;

        questionText.text = question.text;

    }

    public void OnPointerDown(PointerEventData eventData)
    {
        if (cardAnswerInstance != null) return;

        cardAnswerInstance = Instantiate(cardAnswerPrefab, cardTransform).GetComponent<CardAnswer>();
        cardAnswerInstance.transform.localPosition = Vector3.zero;

        cardAnswerInstance.SetQuestion(question);
        cardAnswerInstance.BeginDrag();
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        if (cardAnswerInstance == null) return;
        cardAnswerInstance.EndDrag();
    }

}
