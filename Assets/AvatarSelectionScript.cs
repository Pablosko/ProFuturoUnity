using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class AvatarSelectionScript : MonoBehaviour
{
    public List<AvatarScript> avatars;
    int selectedIndex;
    public TextMeshProUGUI nameText;
    public TextMeshProUGUI infoText;
    public Image avatarImage;

    AudioManager audioManager;

    private void Awake()
    {
        audioManager = GameObject.FindGameObjectWithTag("Audio").GetComponent<AudioManager>();
    }

    void Start()
    {
        ApplyInfo();
    }

    void Update()
    {
        
    }
    public void ApplyInfo() 
    {
        nameText.text = avatars[selectedIndex].avatarName;
        infoText.text = avatars[selectedIndex].info;
        avatarImage.sprite = avatars[selectedIndex].fullSprite;
    }
    public void ChangeRigth() 
    {
        audioManager.PlaySFX(audioManager.avatarSelect);
        selectedIndex++;
        if (selectedIndex >= avatars.Count)
            selectedIndex = 0;
        ApplyInfo();
    }
    public void ChangeLeft()
    {
        audioManager.PlaySFX(audioManager.avatarSelect);
        selectedIndex--;
        if (selectedIndex < 0)
            selectedIndex = avatars.Count- 1;
        ApplyInfo();
    }
    public void SelectAvatar() 
    {
        audioManager.PlaySFX(audioManager.avatarChange);
        HudController.instance.header.SetAvatar(avatars[selectedIndex].headerSprite, avatars[selectedIndex].fullSprite);
    }
}
