using System;
using System.Runtime.InteropServices;
using UnityEngine;

public class SCORMManager : MonoBehaviour
{
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern string getCurseData();

    [DllImport("__Internal")]
    private static extern void saveData(string value);

    [DllImport("__Internal")]
    private static extern void completeCourse();

    [DllImport("__Internal")]
    private static extern string getScore();

    [DllImport("__Internal")]
    private static extern void quitSCORM();
       [DllImport("__Internal")]
    private static extern int initScorm();
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
}
