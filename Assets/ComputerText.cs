using System.Collections;
using UnityEngine;
using UnityEngine.Events;
using TMPro;

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
    public AudioClip speakAudio;

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
        if(text != "")
        AudioManager.instance.PlaySFXLoop(speakAudio);

        float timePerChar = 1f / speed;
        float nextCharTime = Time.time;
        int i = 0;
        string currentText = "";

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
            yield return null;
        }

        uiText.text = currentText;
        isTyping = false;
        endType = true;
        onEndTyping?.Invoke();
        AudioManager.instance.StopFX();
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
