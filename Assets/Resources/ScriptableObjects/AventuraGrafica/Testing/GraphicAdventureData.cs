using UnityEngine;

[CreateAssetMenu(fileName = "GraphicAdventureData", menuName = "Scriptable Objects/GraphicAdventureData")]
public class GraphicAdventureData : ScriptableObject
{
    [TextArea(3,5)]
    public string mainText;
    [Header("Texto que saldra si no hay opciones")]
    [TextArea(1,5)]
    public string rightOption;
    [TextArea(1,5)]
    public string leftOption;
    public bool rigthCorrect;

    [Header("Siguiente pantalla si no hay opciones")]
    public GraphicAdventureData feedbackCorrect;
    public GraphicAdventureData feedbackIncorrect;
    public GraphicAdventureData GetNextScreenData(bool rigth) 
    {
        if (feedbackIncorrect == null)
            return feedbackCorrect;

        return rigth == true ? feedbackCorrect : feedbackIncorrect;
    }
    public bool IsFinal()
    {
        return feedbackCorrect == null && feedbackIncorrect == null;
    }
    public bool IsNextFinal()
    {
        if (feedbackCorrect != null)
            return feedbackCorrect.IsFinal();
        if (feedbackIncorrect != null)
            return feedbackIncorrect.IsFinal();

        return false;
    }
    public bool IsQuestion() 
    {
        return leftOption != "" && rightOption != "";
    }
}
