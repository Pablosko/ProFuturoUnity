using UnityEngine;

[RequireComponent(typeof(Camera))]
public class FixedAspectRatio : MonoBehaviour
{
    public float targetAspect = 16f / 9f;
    private int lastScreenWidth;
    private int lastScreenHeight;
    private Camera cam;

    void Start()
    {
        cam = GetComponent<Camera>();
        //Screen.SetResolution(1280, 720, false);
        lastScreenWidth = Screen.width;
        lastScreenHeight = Screen.height;
        Application.targetFrameRate = 60;
        UpdateAspect();
    }

    void Update()
    {
        if (Screen.width != lastScreenWidth || Screen.height != lastScreenHeight)
        {
            UpdateAspect();
            lastScreenWidth = Screen.width;
            lastScreenHeight = Screen.height;
        }
    }

    void UpdateAspect()
    {
        float windowAspect = (float)Screen.width / Screen.height;
        float scaleHeight = windowAspect / targetAspect;

        if (scaleHeight < 1f)
        {
            cam.rect = new Rect(0f, (1f - scaleHeight) / 2f, 1f, scaleHeight);
        }
        else
        {
            float scaleWidth = 1f / scaleHeight;
            cam.rect = new Rect((1f - scaleWidth) / 2f, 0f, scaleWidth, 1f);
        }
    }
}
