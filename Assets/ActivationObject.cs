using UnityEngine;
using UnityEngine.UI;

public class ActivationObject : MonoBehaviour
{
    public Sprite active;
    public Sprite inactive;
    public Image image;
    public void SetState(bool state) 
    {
        image.sprite = state == true ? active : inactive;
    }
}
