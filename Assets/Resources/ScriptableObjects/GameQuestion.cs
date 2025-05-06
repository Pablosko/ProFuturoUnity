using UnityEngine;

[CreateAssetMenu(fileName = "GameQuestion", menuName = "Scriptable Objects/GameQuestion")]
public class GameQuestion : ScriptableObject
{
    public string text;
    public string rightText;
    public string leftText;
    public string successMessage;
    public string errorMessage;
    public bool correct;

    public void Shuffle() 
    {
        if (Random.Range(0, 100) >= 50) 
        {
            correct = !correct;
            string temp = rightText;
            rightText = leftText;
            leftText = temp;
        }
    }
}
