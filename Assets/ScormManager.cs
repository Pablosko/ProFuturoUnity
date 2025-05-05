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
    private static string getCurseData() { Debug.Log("SCORM INIT (Dummy)"); return "test data"; }
    private static int initScorm() { Debug.Log("SCORM INIT (Dummy)"); return 1; }
    private static void saveData(string value) { Debug.Log("SAVE DATA (Dummy): " + value); }
    private static void completeCourse() { Debug.Log("COMPLETE COURSE (Dummy)"); }
    private static string getScore() { Debug.Log("GET SCORE (Dummy)"); return "0"; }
    private static void quitSCORM() { Debug.Log("QUIT SCORM (Dummy)"); }
#endif

    void Start()
    {
       InitScorm();
       //Debug.Log(getCurseData()); // Ahora no dará error en Editor
    }

    public void SaveScore(int score)
    {
        saveData(score.ToString());
    }
    public int InitScorm() 
    {
        return initScorm();
    }
    public void Complete()
    {
        completeCourse();
    }

    public void Quit()
    {
        quitSCORM();
    }
}
