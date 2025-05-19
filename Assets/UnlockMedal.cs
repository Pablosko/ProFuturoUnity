using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class UnlockMedal : MonoBehaviour
{
    public int number;
    public List<Sprite> medallas = new();
    public Image bigMedalImage;

    AudioManager audioManager;
    private void Awake()
    {
        audioManager = GameObject.FindGameObjectWithTag("Audio").GetComponent<AudioManager>();
    }
    private void Start()
    {
        bigMedalImage.sprite = medallas[number - 1];
        UnlockMedalByint(number);
    }
    public void UnlockMedalByint(int number) 
    {
        audioManager.PlaySFX(audioManager.winMedal);
        HudController.instance.header.SetMedalState(number - 1, true);
        Home.instance.CompleteStage(number);
    }

}
