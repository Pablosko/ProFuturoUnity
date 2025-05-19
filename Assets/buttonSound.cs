using UnityEngine;
using UnityEngine.UI;

public class buttonSound : MonoBehaviour
{
    public AudioClip sound;
    public void TriggerSound() 
    {
        if(sound != null)
        AudioManager.instance.PlaySFX(sound);
    }
}
