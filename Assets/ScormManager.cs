using System.Collections.Generic;
using UnityEngine;
enum ScormStage
{
    sequencia,
    subsequencia,
    aventura,
    postaventura,
    minigame
}
public class SCORMManager : MonoBehaviour
{
    public List<StageData> temasData;
    ScormStage currentStage;
    public Home home;
#if UNITY_WEBGL && !UNITY_EDITOR

    [DllImport("__Internal")]
    private static extern int initScorm();

    [DllImport("__Internal")]
    private static extern void initPage(string value);

    [DllImport("__Internal")]
    private static extern void endPage(string value);

    [DllImport("__Internal")]
    private static extern string pageState(string value);
#else
    // Dummy (falsas) funciones para cuando no estás en WebGL
    private static int initScorm() { Debug.Log("SCORM INIT (Dummy)"); return 1; }
    private static void initPage(string value) { Debug.Log("INIT PAGE (Dummy): " + value); }
    private static void endPage(string value) { Debug.Log("END page(Dummy): " + value); }
    private static string pageState(string value) { Debug.Log("GET STATE (Dummy): " + value); return "0"; }
#endif

    void Start()
    {
        initScorm();
        //Debug.Log(getCurseData()); // Ahora no dará error en Editor
        //ParseSimulation();
    }

    public void InitPage(string pageId)
    {
        initPage(pageId);
    }
    public void EndPage(string pageId)
    {
        endPage(pageId);
    }
    public string PageState(string pageId)
    {
        return pageState(pageId);
    }
    public void ParseSimulation() 
    {
        currentStage = ScormStage.sequencia;
        int t = 0;
        int s = 15; // hay 7 pantallas, si sale 8 subsequencia -> 9 aventura hasta 18, post aventura -> 1.19,1.20.

        for (int i = 1; i <= s; i++)
        {
            if (currentStage == ScormStage.sequencia)
            {
                SequenceManager manager = temasData[t].sequencia.GetComponent<SequenceManager>();
                for (int seq = 0; seq < manager.GetCount(); seq++)
                {
                    if (seq == manager.GetCount() - 1)
                    {
                        currentStage++;
                    }
                    i++;
                    if (i == s)
                    {
                        GoToSequencia(t, s);
                        return;
                    }

                }
            }
            if (currentStage == ScormStage.subsequencia)
            {
                if (i == s)
                {
                    GoToSubsequencia(t, s);
                    return;
                }
                i++;
                currentStage++;
            }
            if (currentStage == ScormStage.aventura)
            {
                AventuraGrafica aventura = temasData[t].aventura.DelayedDelayed();
                for (int adventureScreen = 0; adventureScreen < aventura.TotalScreens; adventureScreen++)
                {
                    if (i == s) 
                    {
                        aventura.SetToScreen(adventureScreen);
                        return;
                    }
                    i++;
                }
                currentStage++;
            }

        }
        if (t > 0)
            temasData[t].sequencia.GetComponent<SequenceManager>().End();

        GoToSequencia(t, s);

    }
    public void GoToSequencia(int tema,int screen) 
    {
        temasData[tema].sequencia.SetActive(true);
        temasData[tema].sequencia.GetComponent<SequenceManager>().GoToSequence(screen);
    }
    public void GoToSubsequencia(int tema, int screen)
    {
        home.gameObject.SetActive(true);
        home.StartStage(tema + 1);
    }
}
[System.Serializable]
public class StageData
{
    public GameObject sequencia;
    public HomeStageUI aventura;
    public GameObject postaventura;
    public GameObject minigame;
}