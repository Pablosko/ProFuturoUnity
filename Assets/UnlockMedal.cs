using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class UnlockMedal : MonoBehaviour
{
    public int number;
    public List<Sprite> medallas = new();
    public Image bigMedalImage;
    private void Start()
    {
        bigMedalImage.sprite = medallas[number - 1];
        UnlockMedalByint(number);
    }
    public void UnlockMedalByint(int number) 
    {
        HudController.instance.header.SetMedalState(number - 1, true);
    }

}
