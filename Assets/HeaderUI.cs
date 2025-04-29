using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class HeaderUI : MonoBehaviour
{
    public Sprite notActiveMedal;
    public List<Sprite> medals;
    public List<Image> medalsUI;
    public Image avatarImage;
    void Start()
    {
        
    }

    void Update()
    {
        
    }
    public void SetMedalState(int index,bool unlocked) 
    {
        medalsUI[index].sprite = unlocked == true ? medals[index] : notActiveMedal;
    }
    private void OnValidate()
    {
        SetAllMedals();
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
    public void SetAvatar(Sprite sprite) 
    {
        avatarImage.sprite = sprite;
    }
}
