using UnityEngine;

public class InputScreen : ScreenComponent
{
    public override bool IsActive()
    {
        return base.IsActive() && !cpu.IsInFeedBack();
    }
}
