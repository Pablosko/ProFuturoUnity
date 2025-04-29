using UnityEngine;
using UnityEngine.UI;

public class AdventureScreenFeedback : AventuraGraficaScreen
{
    public Sprite correctBackground;
    public Sprite incorrectBackground;
    public Sprite defaultBackground;

    public override void SetScreen(GraphicAdventureData data, AventuraGrafica controller)
    {
        base.SetScreen(data, controller);
    }

    public void SetBackground(bool? isCorrect)
    {
        if (isCorrect == true)
            textboxImage.sprite = correctBackground;
        else if (isCorrect == false)
            textboxImage.sprite = incorrectBackground;
        else
            textboxImage.sprite = defaultBackground;
    }
}
