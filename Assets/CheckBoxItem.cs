using TMPro;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;

public class CheckBoxItem : MonoBehaviour
{
    bool active;
    public Sprite activeSprite;
    public Sprite notActiveSprite;
    public Image checkImage;
    public TextMeshProUGUI text;
    public TextMeshProUGUI numberText;
    CheckBoxChecker parent;
    public AudioClip checkClip;

    public void onClick() 
    {
        active = !active;
        checkImage.sprite = active == true ? activeSprite : notActiveSprite;
        parent.AddCheck(active == true ? 1 : -1);
        AudioManager.instance.PlaySFX(checkClip);
    }
    public void SetData(int number, string t,CheckBoxChecker p) 
    {
        text.text = t;
        numberText.text = number.ToString() + ".";
        parent = p;
    }
}
