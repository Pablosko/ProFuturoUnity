using System.Runtime.InteropServices;
using UnityEngine;
public class HudController : MonoBehaviour
{
    public static HudController instance;
    public HeaderUI header;
    public Transform stagesTransform;
    public void Awake()
    {
        instance = this;
    }
    [DllImport("__Internal")]
    private static extern void SendMessageToParent(string message);

    public void NextPage()
    {
        if (Home.instance == null)
        {
            Home.instance = Resources.FindObjectsOfTypeAll<Home>()[0];
        }
        if (Home.instance != null)
            Home.instance.gameObject.SetActive(true);
        Home.instance.MoveCameraToFullView();

#if UNITY_WEBGL && !UNITY_EDITOR
    SendMessageToParent("juego_completado");
#else
        Debug.Log("Esto solo funciona en WebGL");
#endif
    }
}
