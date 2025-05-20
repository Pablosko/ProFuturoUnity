using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using System;

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
    public List<AvatarScript> avatars;
    public static SCORMManager instance;
#if UNITY_WEBGL && !UNITY_EDITOR

    [DllImport("__Internal")]
    private static extern int initScorm();

    [DllImport("__Internal")]
    private static extern void initPage(string value);

    [DllImport("__Internal")]
    private static extern void endPage(string value);

    [DllImport("__Internal")]
    private static extern string pageState(string value);

    [DllImport("__Internal")]
    private static extern string getAvatar();

    [DllImport("__Internal")]
    private static extern void saveAvatar(string value);

    [DllImport("__Internal")]
    private static extern void downloadPDF(string url);

    [DllImport("__Internal")]
    private static extern void closeBrowserWindow();
#else
    // Dummy (falsas) funciones para cuando no estás en WebGL
    private static int initScorm() { Debug.Log("SCORM INIT (Dummy)"); return 1; }
    private static void initPage(string value) { Debug.Log("INIT PAGE (Dummy): " + value); }
    private static void endPage(string value) { Debug.Log("END page(Dummy): " + value); }
    private static string pageState(string value) { Debug.Log("GET STATE (Dummy): " + value); return "0"; }
    private static void saveAvatar(string value) { Debug.Log("SAVE AVATAR (Dummy): " + value); }
    private static string getAvatar() { Debug.Log("GET AVATAR (Dummy)"); return "0"; }
    private static void downloadPDF(string url) { Debug.Log("DOWNLOAD FILE (Dummy): " + url);}
    private static void closeBrowserWindow() { Debug.Log("CLOSE WINDOW (Dummy)"); }
#endif
    private void Awake()
    {
        instance = this;
    }
    void Start()
    {
        initScorm();
        //Debug.Log(getCurseData()); // Ahora no dará error en Editor
        ParseSimulation();
    }
    public void InitPage(string pageId)
    {
        if (pageId == "")
            Debug.LogError("Pagina sin id");    
        initPage(pageId);
    }
    public void EndPage(string pageId)
    {
        if (pageId == "")
            Debug.LogError("Pagina sin id");
        endPage(pageId);
    }
    public string PageState(string pageId)
    {
        return pageState(pageId);
    }
    public string GetAvatar()
    {
        string avatar = getAvatar();
        if (avatar == null || avatar == "") { avatar = "0"; }
        return avatar;
    }
    public void SaveAvatar(string avatar)
    {
        saveAvatar(avatar);
    }
    public void DownloadPDF(string fileNameWithoutExtension)
    {
        string fileName = fileNameWithoutExtension + ".pdf";
        string relativePath = fileName;
        downloadPDF(relativePath);
    }


    public void CloseGame()
    {
        closeBrowserWindow();
    }
    public void ParseSimulation() 
    {
        currentStage = ScormStage.sequencia;
        var pagesTema = new int[] { 20, 17, 11, 11, 16, 3 };
        int avatarTest = 0;        
        int t = 0;
        int s = 1;
#if UNITY_WEBGL && !UNITY_EDITOR
        bool encontrado = false;
        if(PageState("6_1_3") == "C"){
            encontrado = true;
            t = 6;
            s = 3;
        }
        for (int i = 0; i < pagesTema.Length && !encontrado; i++)
        {
            for (int j = 1; j <= pagesTema[i]; j++)
            {
                string estado = PageState(i+1 + "_1_" + j);
                if (estado != "C")
                {
                    t = i;
                    s = j;
                    encontrado = true;
                    break;
                }
            }
        }
        avatarTest = int.Parse(GetAvatar());

#endif
        // hay 7 pantallas, si sale 8 subsequencia -> 9 aventura hasta 18, post aventura -> 1.19,1.20.
        if (!(t == 0 && s < 8)) 
        {
            HudController.instance.header.gameObject.SetActive(true);
            HudController.instance.header.SetAvatar(avatars[avatarTest].headerSprite, avatars[avatarTest].fullSprite);
        }
        HudController.instance.header.SetAllMedals(t);
        for (int i = 1; i <= s; i++)
        {
            if (currentStage == ScormStage.sequencia)
            {
                SequenceManager manager;
                manager = temasData[t].sequencia.GetComponent<SequenceManager>();
                    for (int seq = 0; seq < manager.GetCount(); seq++)
                    {
                    if (i == s)
                    {
                        if (t == 0)
                        {
                            manager.gameObject.SetActive(true);
                            GoToSequencia(manager, t, seq);
                        }
                        else 
                        {
                            GameObject go = Instantiate(temasData[t].sequencia, HudController.instance.stagesTransform);
                            GoToSequencia(go.GetComponent<SequenceManager>(), t, seq);
                        }
                        return;
                    }
                    if (seq == manager.GetCount() - 1)
                        {
                            currentStage++;
                        }
                        i++;
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
                AventuraGrafica aventura = temasData[t].aventura.adventurePrefab.GetComponent<AventuraGrafica>();
                for (int adventureScreen = 0; adventureScreen < aventura.TotalScreens; adventureScreen++)
                {
                    if (i == s)
                    {
                        aventura = temasData[t].aventura.DelayedDelayed();
                        aventura.SetToScreen(adventureScreen);
                        return;
                    }
                    i++;
                }
                currentStage++;
            }
            if (currentStage == ScormStage.postaventura)
            {

                SequenceManager manager = temasData[t].postaventura.GetComponent<SequenceManager>();
                for (int seq = 0; seq < manager.GetCount(); seq++)
                {
                    if (i == s)
                    {
                        GameObject go = Instantiate(temasData[t].postaventura, HudController.instance.stagesTransform);
                        GoToSequencia(go.GetComponent<SequenceManager>(), t, seq);
                        return;
                    }
                    if (seq == manager.GetCount() - 1)
                    {
                        currentStage++;
                    }
                    i++;

                }
            }
            if (currentStage == ScormStage.minigame)
            {
                MiniGameTrasform.instance.StartMiniGame(temasData[t].minigame);
                return;
            }
            Debug.LogError("Cargando pantalla inexistente en el sistema");

        }
    }
    public void GoToSequencia(SequenceManager manager,int tema,int screen) 
    {
        manager.gameObject.SetActive(true);
        manager.GoToSequence(screen);
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