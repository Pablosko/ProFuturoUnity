using System.Runtime.InteropServices;
using UnityEngine;

public class SCORMManager : MonoBehaviour
{
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void initSCORM();

    [DllImport("__Internal")]
    private static extern void saveData(string value);

    [DllImport("__Internal")]
    private static extern void completeCourse();

    [DllImport("__Internal")]
    private static extern string getScore();

    [DllImport("__Internal")]
    private static extern void quitSCORM();
#else
    // Dummy (falsas) funciones para cuando no estás en WebGL
    private static void initSCORM() { Debug.Log("SCORM INIT (Dummy)"); }
    private static void saveData(string value) { Debug.Log("SAVE DATA (Dummy): " + value); }
    private static void completeCourse() { Debug.Log("COMPLETE COURSE (Dummy)"); }
    private static string getScore() { Debug.Log("GET SCORE (Dummy)"); return "0"; }
    private static void quitSCORM() { Debug.Log("QUIT SCORM (Dummy)"); }
#endif

    void Start()
    {
        initSCORM(); // Ahora no dará error en Editor
    }

    public void SaveScore(int score)
    {
        saveData(score.ToString());
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
