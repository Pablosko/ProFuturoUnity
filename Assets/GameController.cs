using UnityEngine;

public class GameController : MonoBehaviour
{
    public static GameController instance;
    public GameObject muteBar;
    private void Awake()
    {
        instance = this;
    }
    public void MuteSound() 
    {
        muteBar.SetActive(!muteBar.activeSelf);
    }
    public void GoHome() 
    {
    }
    public void Exit() 
    {
        Application.Quit();
    }
}
