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
    public void Update()
    {
        if (Input.GetKey(KeyCode.LeftShift))
        {
            for (int i = 1; i <= 5; i++)
            {
                if (Input.GetKeyDown(KeyCode.Alpha0 + i))
                {
                    GoHomeAndUnlockStage(i);
                }
                if (Input.GetKey(KeyCode.Alpha0 + i))
                    if (Input.GetKeyDown(KeyCode.D))
                    {
                        GoToMiniGame(i);
                    }
            }
        }
    }
    public void GoToMiniGame(int stage) 
    {
        ClearAll();
        Home.instance.homeStagesUI[stage].GoToMinigame();
    }
    public void ClearAll() 
    {
        SequenceManager[] sequencesManagers = Object.FindObjectsByType<SequenceManager>(FindObjectsSortMode.None);

        for (int i = 0; i < sequencesManagers.Length; i++)
        {
            sequencesManagers[i].End();
        }
        Game[] games = Object.FindObjectsByType<Game>(FindObjectsSortMode.None);

        for (int i = 0; i < games.Length; i++)
        {
            Destroy(games[i].gameObject);
        }
  
    }
    public void GoHomeAndUnlockStage(int stage) 
    {
        ClearAll();
        Home.instance.gameObject.SetActive(true);
        Home.instance.SetStageClickable(stage);
        Home.instance.currentStage = stage;
        Home.instance.SetStageUnlocks();
        HudController.instance.header.SetAllMedals(stage - 1);
    }
    public void GoHome() 
    {
    }
    public void Exit() 
    {
        Application.Quit();
    }
}
