using Unity.VisualScripting;
using UnityEngine;

public class AnimatedSequence : SequenceBase
{
    public float animationDuration;
    private float currentDuration;
    public bool endSequence;
 
    public override void OnStart(SequenceManager sm)
    {
        base.OnStart(sm);
        currentDuration = 0;
        if (gameObject.name == "01_MovingShip(Clone)")
        {            
            AudioManager.instance.PlaySFX(AudioManager.instance.spaceship);
        }
    }

    public override void Update()
    {
        base.Update();
        if(endSequence)
            ProgressTime();

    }
    public void ProgressTime() 
    {
        currentDuration += Time.deltaTime;
        if (currentDuration >= animationDuration) 
        {
            End();
            currentDuration = -1000;
        }
    }
}
