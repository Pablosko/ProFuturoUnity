﻿using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Collections.Generic;
using System.Collections;

public class AventuraGrafica : MonoBehaviour
{
    public GameObject questionScreenPrefab;
    public GameObject feedbackScreenPrefab;
    public GameObject lastFeedbackScreen;
    public Transform instanciateScreenTransform;

    public GameObject nextSequenceManager;

    public int temaNumero = 1;
    private GraphicAdventureData currentData;
    GameObject screenObj;
    public int TotalScreens;
    private enum FeedbackType { None, Correct, Incorrect }
    private FeedbackType pendingBackground = FeedbackType.None;

   

    private void Start()
    {
        AudioManager.instance.PlayMusic(AudioManager.instance.storytellingBg);
    }

    void OnEnable()
    {
        Invoke("Delay", 0.5f);
    }
    public void Update()
    {
        if (Input.GetKey(KeyCode.LeftControl))
        {
            if (Input.GetKeyDown(KeyCode.S))
            {
                End();
            }
        }
    }
    public int GetScreenCount() 
    {
        return TotalScreens;
    }
    public void Delay() 
    {
        SetAdventureFromTema(temaNumero);
    }

    public void SetAdventureFromTema(int tema,int screen = 1)
    {
        if (currentData != null)
            return;
        string folderPath = $"ScriptableObjects/AventuraGrafica/Tema{tema}/" + screen;
        string assetName = $"Tema{tema}_"+screen+"_Screen";
        var data = Resources.Load<GraphicAdventureData>($"{folderPath}/{assetName}");

        if (data != null)
        {
            currentData = data;
            SetScreen(data);
        }
        else
        {
            assetName = $"Tema{tema}_" + screen + "_Selection";
            data = Resources.Load<GraphicAdventureData>($"{folderPath}/{assetName}");
            if (data == null)
                Debug.LogError($"❌ No se encontró la pantalla inicial en: {folderPath}/{assetName}");
            else 
            {
                currentData = data;
                SetScreen(data);
            }
        }
    }
    void SetScreen(GraphicAdventureData data)
    {
        data.Init();
        if(currentData != null)
        currentData.EndPage();
        currentData = data;
        if (screenObj != null)
            Destroy(screenObj);

        if (data.IsFinal())
            screenObj = Instantiate(lastFeedbackScreen, instanciateScreenTransform);
        else if (data.IsQuestion()) 
        {
            screenObj = Instantiate(questionScreenPrefab, instanciateScreenTransform);
            screenObj.GetComponent<AventuraGraficaScreen>().randomizer.RandimzeAll();
        }
        else
            screenObj = Instantiate(feedbackScreenPrefab, instanciateScreenTransform);

        screenObj.SetActive(true); // Forzamos su activación

        AventuraGraficaScreen screen = screenObj.GetComponent<AventuraGraficaScreen>();

        if (screen is AdventureScreenFeedback feedbackScreen && !data.IsFinal())
        {
            switch (pendingBackground)
            {
                case FeedbackType.Correct:
                    feedbackScreen.text.autoSpeak = true;
                    feedbackScreen.SetBackground(true);
                    AudioManager.instance.PlaySFX(AudioManager.instance.storytellingFbOk);
                    break;
                case FeedbackType.Incorrect:
                    feedbackScreen.text.autoSpeak = true;
                    feedbackScreen.SetBackground(false);
                    AudioManager.instance.PlaySFX(AudioManager.instance.storytellingFbKo,0.40f);
                    break;
                default:
                    feedbackScreen.SetBackground(null);                    
                    break;
            }
        }

        screen.SetScreen(data, this);
        pendingBackground = FeedbackType.None;
    }

    public void Next(bool correct)
    {
        bool realCorrect = correct != currentData.rigthCorrect;

        if (currentData.IsQuestion())
            pendingBackground = realCorrect ? FeedbackType.Correct : FeedbackType.Incorrect;
        else
            pendingBackground = FeedbackType.None;
            AudioManager.instance.PlaySFX(AudioManager.instance.nextBtn);

        if (currentData.IsFinal())
        {
            End();
            return;
        }

        var nextData = currentData.GetNextScreenData(realCorrect);
        SetScreen(nextData);
    }
    public void End() 
    {
       currentData.EndPage();
       SequenceManager sq = Instantiate(nextSequenceManager, HudController.instance.stagesTransform).GetComponent<SequenceManager>();
       sq.LoadFirstSequence();
       Destroy(gameObject);
    }
    public void SetToScreen(int index) 
    {
        SetAdventureFromTema(temaNumero, index);
    }
}

