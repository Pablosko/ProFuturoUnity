using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameController : MonoBehaviour
{
    public static GameController instance;
    public GameObject muteBar;
    public Slider slider;
    [SerializeField] private Slider volumeSlider;

    private float lastVolume = 1f;
    private bool isMuting = false;

    public void SetSound(float volume)
    {
        muteBar.SetActive(volume == 0);

        // Si NO estamos muteando, guardamos el valor
        if (!isMuting && volume > 0)
        {
            lastVolume = volume;
        }

        AudioManager.instance.SetMasterVolume(volume);
    }

    public void MuteSound()
    {
        bool isMuted = muteBar.activeSelf;

        if (!isMuted)
        {
            // Estamos muteando
            isMuting = true;
            lastVolume = volumeSlider.value; // guardar antes de poner 0
            volumeSlider.value = 0;
        }
        else
        {
            // Desmutear
            isMuting = true;
            volumeSlider.value = lastVolume;
        }

        // Pequeña espera para evitar conflictos con OnValueChanged
        StartCoroutine(ResetMutingFlag());
    }

    private IEnumerator ResetMutingFlag()
    {
        yield return null; // esperar 1 frame
        isMuting = false;
    }
    public void Update()
    {
        if (Input.GetKey(KeyCode.LeftShift))
        {
            for (int i = 1; i <= 5; i++)
            {
                if (Input.GetKeyDown(KeyCode.Alpha0 + i))
                {
                    GoHomeAndUnlockStage(i);
                }
                if (Input.GetKey(KeyCode.Alpha0 + i))
                    if (Input.GetKeyDown(KeyCode.D))
                    {
                        GoToMiniGame(i);
                    }
            }
        }
    }
    public void GoToMiniGame(int stage) 
    {
        ClearAll();
        Home.instance.homeStagesUI[stage].GoToMinigame();
    }
    public void ClearAll() 
    {
        SequenceManager[] sequencesManagers = Object.FindObjectsByType<SequenceManager>(FindObjectsSortMode.None);

        for (int i = 0; i < sequencesManagers.Length; i++)
        {
            sequencesManagers[i].End();
        }
        Game[] games = Object.FindObjectsByType<Game>(FindObjectsSortMode.None);

        for (int i = 0; i < games.Length; i++)
        {
            Destroy(games[i].gameObject);
        }
  
    }
    public void GoHomeAndUnlockStage(int stage) 
    {
        ClearAll();
        Home.instance.gameObject.SetActive(true);
        Home.instance.UnlockStage(stage);
        Home.instance.currentStage = stage;
        Home.instance.SetStageUnlocks();
        HudController.instance.header.SetAllMedals(stage - 1);
        Home.instance.MoveCameraToFullView();
    }
    public void GoHome() 
    {
        ClearAll();
        Home.instance.gameObject.SetActive(true);
        Home.instance.MoveCameraToFullView();
    }
    public void Exit() 
    {
        SCORMManager.instance.CloseGame();
        Application.Quit();
    }
}
