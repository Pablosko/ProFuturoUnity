using System.Collections;
using System.Collections.Generic;
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

    public CardAnswer cardAnswerInstance;

    public void SetData(GameQuestion q, RectTransform _cardTransform, Transform _rightLerpTransform)
    {
        question = q;
        cardTransform = _cardTransform;
        rightLerpTransform = _rightLerpTransform;

        questionText.text = question.text;

    }
    private Coroutine autoSwipeRoutine;
    public bool autoSwiping = false;
    bool canSwipe = true;

    public void StartAutoSwipe()
    {
        if (autoSwiping || !canSwipe) return;

        SpawnCard();
        autoSwiping = true;
        autoSwipeRoutine = StartCoroutine(AutoSwipeLoop());
    }
    private IEnumerator AutoSwipeLoop()
    {
        RectTransform rect = cardAnswerInstance.GetComponent<RectTransform>();
        float threshold = cardAnswerInstance.activationThreshold;

        float maxX = threshold * 175; // máximo desplazamiento
        float maxAngle = 30f;          // máxima rotación
        float speed = 350f;            // velocidad de ida y vuelta (ajustable)

        float time = maxX;

        while (autoSwiping && cardAnswerInstance != null)
        {
            time += Time.deltaTime * speed;

            // Movimiento de ida y vuelta con PingPong
            float x = Mathf.PingPong(time, maxX * 2f) - maxX;

            // Actualiza posición
            if(cardAnswerInstance != null)
                rect.anchoredPosition = new Vector2(x, 0f);

            // Rotación suave proporcional (limitada a ±30°)
            float rotationZ = Mathf.Clamp(-x / maxX * maxAngle, -maxAngle, maxAngle);
            if(cardAnswerInstance != null)
            cardAnswerInstance.transform.localRotation = Quaternion.Euler(0, 0, rotationZ);

            // Mostrar u ocultar texto
            if (Mathf.Abs(x) > threshold && cardAnswerInstance.contentText.text == "")
            {
            if(cardAnswerInstance != null)
                    cardAnswerInstance.contentText.text = x > 0 ? question.rightText : question.leftText;
            }
            else if (Mathf.Abs(x) < threshold && cardAnswerInstance.contentText.text != "")
            {
                if (cardAnswerInstance != null)
                    cardAnswerInstance.contentText.text = "";
            }

            yield return null;
        }
    }

    public void StopAutoSwipe()
    {
        if (!autoSwiping) return;

        autoSwiping = false;
        if (autoSwipeRoutine != null)
            StopCoroutine(autoSwipeRoutine);

        DestroyCard(false);
    }

    public void OnPointerDown(PointerEventData eventData)
    {
        canSwipe = false;
        SpawnCard();
    }
    public void SpawnCard() 
    {
        if (cardAnswerInstance != null) return;

        cardAnswerInstance = Instantiate(cardAnswerPrefab, cardTransform).GetComponent<CardAnswer>();
        cardAnswerInstance.transform.localPosition = Vector3.zero;

        cardAnswerInstance.SetQuestion(question);
        cardAnswerInstance.BeginDrag();
    }
    public void DestroyCard(bool feedback) 
    {
        if (cardAnswerInstance == null) return;
        cardAnswerInstance.EndDrag(feedback);
    }
    public void OnPointerUp(PointerEventData eventData)
    {
        canSwipe = true;
        DestroyCard(true);
    }

}
