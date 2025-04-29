using UnityEngine;

public class SequenceBase : MonoBehaviour
{
    [HideInInspector]
    public SequenceManager sequenceManager;
    public bool hasTransition;
    public void Start() 
    {
    
    }
    public virtual void OnStart(SequenceManager sm)
    {
        sequenceManager = sm;
    }
    public virtual void Update()
    {

    }
    protected virtual void OnEnd()
    {
    }
    public void End()
    {
        OnEnd();
        if (hasTransition)
            PlayTransition();
        else
            LoadNextSequence();
    }
    public void PlayTransition() 
    {
        TransitionController.instance.PlayFadeOff();
        TransitionController.instance.action.AddListener(EndTransition);
    }
    public void EndTransition() 
    {
        TransitionController.instance.action.RemoveListener(EndTransition);
        LoadNextSequence();
    }
    protected virtual void LoadNextSequence() 
    {
        sequenceManager.NextSequence();
        Desactivate();

    }
    public void Desactivate() 
    {
        gameObject.SetActive(false);
    }
}
