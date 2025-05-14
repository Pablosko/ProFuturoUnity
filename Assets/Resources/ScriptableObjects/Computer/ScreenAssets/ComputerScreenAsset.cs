using UnityEngine;

[CreateAssetMenu(fileName = "Screen", menuName = "Scriptable Objects/Screen")]
public class ComputerScreenAsset : ScriptableObject
{
    public GameObject screenPrefab;
    [TextArea(3, 5)] public string text;
    public InputData inputData;
    public Sprite image;

    [TextArea] public string feedbackCorrectText;
    public bool temporalFeedBack;
    [TextArea] public string feedbackIncorrectText;

    public bool HasInput => inputData.IsValid;
    public bool HasOptions => inputData.HasOptions();
    public bool HasFeedback => feedbackCorrectText != "" || feedbackIncorrectText != "";
    [HideInInspector]
    public Computer cpu;
    public ComponentsConfiguration overrideConfiguration;


}
