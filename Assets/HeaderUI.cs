using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class HeaderUI : MonoBehaviour
{
    public Sprite notActiveMedal;
    public List<Sprite> medals;
    public List<Image> medalsUI;
    public Image avatarImage;
    public Sprite spawnedAvatar;
    void Start()
    {
        
    }

    void Update()
    {
        
    }
    public void SetMedalState(int index,bool unlocked) 
    {
        medalsUI[index].sprite = unlocked == true ? medals[index] : notActiveMedal;
        if(unlocked)
            Home.instance.CompleteStage(index + 1);
    }
    private void OnValidate()
    {
        SetAllMedals();
    }
    public bool HasMedal(int stage) 
    {
        return medals[stage - 1] == notActiveMedal;
    }
    public void SetAllMedals() 
    {
        int index = 0;
        foreach (Image ui in medalsUI)
        {
            SetMedalState(index,false);
            index++;
            
        }
    }
    public void SetAllMedals(int stage)
    {
        int index = 0;
        foreach (Image ui in medalsUI)
        {
            if (index >= stage)
                return;
            SetMedalState(index, true);
            index++;
        }
    }
    public void SetAvatar(Sprite sprite,Sprite full) 
    {
        avatarImage.sprite = sprite;
        spawnedAvatar = full;
    }
}
