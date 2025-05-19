using System.Collections;
using UnityEngine;
using UnityEngine.Events;
using TMPro;
using System.Collections.Generic;

public class ComputerText : MonoBehaviour
{
    public TextMeshProUGUI uiText;
    public string message = "Hola <color=rojo>mundo</color>!";
    public float speed = 100f;
    public bool instant = false;
    public UnityEvent onEndTyping;
    public TagConfigs tagCongifs;

    private Coroutine typingCoroutine;
    private string processedText;
    private bool isTyping = false;
    public bool endType = false;
    public List<AudioClip> effectClicks;


    public void StartType(string text,Computer cpu)
    {
        text = cpu.ComputeText(text);
        processedText = ProcessTags(text);
        message = text;
        if (typingCoroutine != null)
            StopCoroutine(typingCoroutine);

        typingCoroutine = StartCoroutine(TypeMessage(processedText));
    }

    IEnumerator TypeMessage(string text)
    {
        uiText.text = "";
        isTyping = true;

        if (instant)
        {
            uiText.text = text;
            isTyping = false;
            endType = true;
            onEndTyping?.Invoke();
            yield break;
        }

        float timePerChar = 1f / speed;
        float nextCharTime = Time.time;
        int i = 0;
        string currentText = "";
        int effectCount = 3;
        int currentEffectCount = 0;
        while (i < text.Length)
        {
            // Añadir etiquetas HTML de forma correcta
            if (text[i] == '<')
            {
                int closeIndex = text.IndexOf('>', i);
                if (closeIndex != -1)
                {
                    string tag = text.Substring(i, closeIndex - i + 1);
                    currentText += tag;
                    i = closeIndex + 1;
                    continue;
                }
            }

            // Calcular cuántas letras mostrar esta vez
            int lettersToShow = 0;
            float now = Time.time;

            while (now >= nextCharTime && i < text.Length)
            {
                lettersToShow++;
                nextCharTime += timePerChar;
            }

            for (int j = 0; j < lettersToShow && i < text.Length; j++)
            {
                currentText += text[i];
                i++;
            }

            uiText.text = currentText + "_";
            if (currentEffectCount >=effectCount) 
            {
                TriggerSoundEffect();
                currentEffectCount = 0;
            }
            currentEffectCount++;
            yield return null;
        }
        uiText.text = currentText;
        isTyping = false;
        endType = true;
        onEndTyping?.Invoke();
    }
    public void TriggerSoundEffect()
    {
        if (effectClicks.Count > 0)
            AudioManager.instance.PlaySFX(effectClicks[Random.Range(0, effectClicks.Count)],1,8f,12f);
    }
    public void Skip()
    {
        if (typingCoroutine != null)
        {
            StopCoroutine(typingCoroutine);
            typingCoroutine = null;
        }

        uiText.text = processedText;
        isTyping = false;
        onEndTyping?.Invoke();
        endType = true;
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
}
