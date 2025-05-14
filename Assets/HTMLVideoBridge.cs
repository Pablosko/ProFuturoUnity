using UnityEngine;

public class HTMLVideoBridge : MonoBehaviour
{
    public SequenceVideo sequenceVideo;
    public static HTMLVideoBridge instance;
    private void Awake()
    {
        instance = this;
    }
    public void OnHTMLVideoFinished()
    {
        sequenceVideo?.FinishFromHTML();
    }
}