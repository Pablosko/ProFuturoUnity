using UnityEngine;
using System.Collections;

public class SequenceVideo : SequenceBase
{
    [Header("Nombre del video (sin .mp4)")]
    public string videoName = "intro_trailer_profuturo_v3";

    private bool finished = false;

    public override void OnStart(SequenceManager sm)
    {
        base.OnStart(sm);
        if (autoSkip)
            return;
        HTMLVideoBridge bridge = HTMLVideoBridge.instance;
        if (bridge != null)
        {
            bridge.sequenceVideo = this;
            Debug.Log("🔗 VideoBridge enlazado con SequenceVideo");
        }
        else
        {
            Debug.LogWarning("⚠️ No se encontró VideoBridge");
        }
#if UNITY_WEBGL && !UNITY_EDITOR
        string jsPath = $"StreamingAssets/Videos/{videoName}.mp4";
        Application.ExternalEval($"playHTMLVideo('{jsPath}')");
#else
        Debug.Log($"▶ Simulando video: {videoName}");
        StartCoroutine(SimulateVideo());
#endif
        End();
    }

    public void FinishFromHTML()
    {
        if (autoSkip)
            return;
        if (finished) return;
        finished = true;
        Debug.Log("🎬 HTML pidió finalizar video → llamando End()");
        End();
    }

    private IEnumerator SimulateVideo()
    {
        yield return new WaitForSeconds(5f); // simulación en editor
        FinishFromHTML();
    }
}
