using UnityEngine;

public class SubSequence : MonoBehaviour
{
    [HideInInspector]
    public SubSequenceManager sequenceManager;
    public bool deactivateOnEnd;
    public void Start()
    {

    }
    public virtual void OnStart(SubSequenceManager sm)
    {
        sequenceManager = sm;
        transform.localScale = Vector3.one;
        transform.position = Vector3.zero;
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
        LoadNextSubSequence();
    }
    protected virtual void LoadNextSubSequence()
    {
        sequenceManager.NextSubSequence();
        if(deactivateOnEnd)
            Desactivate();

    }
    public void Desactivate()
    {
        gameObject.SetActive(false);
    }
}
