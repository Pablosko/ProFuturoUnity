using UnityEngine;

public class UnlockMedal : MonoBehaviour
{
    public int number;
    private void Start()
    {
        UnlockMedalByint(number);
    }
    public void UnlockMedalByint(int number) 
    {
        HudController.instance.header.SetMedalState(number - 1, true);
    }

}
