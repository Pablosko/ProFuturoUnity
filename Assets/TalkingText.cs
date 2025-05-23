﻿using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Events;

[System.Serializable]
public struct TalkingTextContent
{
    [TextArea(3, 5)]
    public string message;
    public string nextmessage;
    public UnityEvent onStartTalkEvent;
    public UnityEvent onEndTalkEvent;
    public UnityEvent undoButtonEvent;
}

public class TalkingText : MonoBehaviour
{
    public AudioClip talkingSound;
    public List<TalkingTextContent> messages;
    public TextMeshProUGUI contentText;
    public float lettersPerSecond = 100f;
    private int currentMessageIndex = 0;
    private Coroutine typingCoroutine;
    public TagConfigs tagCongifs;
    public GameObject nextButton;
    public GameObject previusButton;
    public UnityEvent onEndConversation;
    public UnityEvent onLastMessageEnd;
    public bool autoSpeak;

    private bool isTyping = false;
    private string currentFullMessage;
    public bool dontstart;
    AudioManager audioManager;
    private void Awake()
    {
        audioManager = GameObject.FindGameObjectWithTag("Audio").GetComponent<AudioManager>();
    }
    void Start()
    {
        if (dontstart)
            return;
        CheckButtonStates();
        if (messages.Count > 0)
        {
            messages[currentMessageIndex].onStartTalkEvent?.Invoke();
            ShowMessage(ProcessTags(messages[currentMessageIndex].message));
        }
    }

    void Update()
    {
        /*
        if (!autoSpeak && isTyping && Input.GetMouseButtonDown(0))
        {
            PutAllText();
        }
        */
    }

    public void ShowMessage(string message)
    {
        if(autoSpeak == false)
            AudioManager.instance.PlaySFXLoop(talkingSound, 1);


        SetNextMessage();
        if (typingCoroutine != null)
            StopCoroutine(typingCoroutine);

        currentFullMessage = message;

        if (autoSpeak)
        {
            PutAllText();
        }
        else
        {
            // Manual: iniciar la animación de tipeo
            typingCoroutine = StartCoroutine(TypeText(message));
        }
    }
    public void StopTalk() 
    {
        AudioManager.instance.StopFX();
    }
    IEnumerator TypeText(string message)
    {
        contentText.text = "";
        int i = 0;
        isTyping = true;

        float accumulatedTime = 0f;
        float secondsPerLetter = 1f / lettersPerSecond;

        while (i < message.Length)
        {
            accumulatedTime += Time.deltaTime;

            int lettersToShow = Mathf.FloorToInt(accumulatedTime / secondsPerLetter);
            if (lettersToShow == 0)
            {
                yield return null;
                continue;
            }

            accumulatedTime -= lettersToShow * secondsPerLetter;

            while (lettersToShow > 0 && i < message.Length)
            {
                if (message[i] == '<')
                {
                    int closeTag = message.IndexOf('>', i);
                    if (closeTag != -1)
                    {
                        string tag = message.Substring(i, closeTag - i + 1);
                        contentText.text += tag;
                        i = closeTag + 1;
                        continue;
                    }
                }

                contentText.text += message[i];
                i++;
                lettersToShow--;
            }

            yield return null;
        }
        if(messages.Count > 0)
        messages[currentMessageIndex].onEndTalkEvent?.Invoke();
        StopTalk();

        if (currentMessageIndex >= messages.Count - 1)
            onLastMessageEnd?.Invoke();

        isTyping = false;
    }

    public void Next()
    {
        Debug.Log(gameObject.transform.parent);
        if (isTyping)
        {
            PutAllText();
            return;
        }
        AudioManager.instance.PlaySFX(AudioManager.instance.nextBtn);

        if (currentMessageIndex < messages.Count - 1)
        {
            currentMessageIndex++;
            messages[currentMessageIndex].onStartTalkEvent?.Invoke();
            ShowMessage(ProcessTags(messages[currentMessageIndex].message));
        }
        else
        {
            EndConversation();
        }
        CheckButtonStates();
    }
    public void SetAndPlayMessage(string text)
    {
        // Detener lo que se esté escribiendo
        if (typingCoroutine != null)
        {
            StopCoroutine(typingCoroutine);
            typingCoroutine = null;
        }

        // Detener sonido si estaba escribiendo
        StopTalk();

        // Reset de estado
        isTyping = false;
        currentMessageIndex = 0;
        contentText.text = "";
        currentFullMessage = "";

        // Limpiar y agregar único mensaje
        messages = new List<TalkingTextContent>
    {
        new TalkingTextContent
        {
            message = text,
        }
    };

        // Mostrar desde cero
        CheckButtonStates();
        messages[0].onStartTalkEvent?.Invoke();
        ShowMessage(ProcessTags(messages[0].message));
    }
    public void Prev()
    {
        if (isTyping)
        {
            PutAllText();
            return;
        }
        AudioManager.instance.PlaySFX(AudioManager.instance.prevBtn);
        if (currentMessageIndex > 0)
        {
            messages[currentMessageIndex].undoButtonEvent?.Invoke();
            currentMessageIndex--;
            ShowMessage(ProcessTags(messages[currentMessageIndex].message));
        }
        CheckButtonStates();
    }

    void EndConversation()
    {
        gameObject.SetActive(false);
        if (onEndConversation != null)
            onEndConversation.Invoke();
    }

    string ProcessTags(string rawText)
    {
        if (tagCongifs == null) return rawText;

        string result = rawText;

        foreach (var tag in tagCongifs.tags)
        {
            string openTag = $"<color={tag.tagName}>";
            string hex = ColorUtility.ToHtmlStringRGB(tag.color);
            result = result.Replace(openTag, $"<color=#{hex}>");
        }

        return result;
    }

    public void ApplyText(string newText)
    {
        if (messages.Count == 0)
            messages.Add(new TalkingTextContent());

        messages[0] = new TalkingTextContent { message = newText };

        currentMessageIndex = 0;
        ShowMessage(ProcessTags(messages[0].message));
    }
    public void CheckButtonStates() 
    {
       // nextButton?.SetActive(currentMessageIndex < messages.Count - 1);
            if(previusButton !=null)
        previusButton.SetActive(currentMessageIndex > 0);
    }
    public void PutAllText()
    {
        if (typingCoroutine != null)
        {
            StopCoroutine(typingCoroutine);
            typingCoroutine = null;
        }

        contentText.text = currentFullMessage;
        SetNextMessage();
        isTyping = false;
        messages[currentMessageIndex].onEndTalkEvent?.Invoke();
        StopTalk();

        if (currentMessageIndex >= messages.Count - 1)
            onLastMessageEnd?.Invoke();

    }
    public void SetNextMessage() 
    {
        if (nextButton == null)
            return;
            if (messages[currentMessageIndex].nextmessage == null)
                return;
   
            nextButton.transform.GetComponentInChildren<TextMeshProUGUI>().text = messages[currentMessageIndex].nextmessage == "" ? "Siguiente" : messages[currentMessageIndex].nextmessage;
    }
}
