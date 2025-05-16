using UnityEngine;
public class SequenceBase : MonoBehaviour
{
    [HideInInspector]
    public SequenceManager sequenceManager;
    public bool hasTransition;
    public string id;
    public AudioClip music;
    public virtual void Awake()
    {
        if(music != null)
        AudioManager.instance.PlayMusic(music);  
    }

    private void Start() 
    {

    }
    public virtual void OnStart(SequenceManager sm)
    {
        sequenceManager = sm;
        SCORMManager.instance.InitPage(id);
    }
    public virtual void Update()
    {

    }
    protected virtual void OnEnd()
    {
        SCORMManager.instance.EndPage(id);
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

    public void PlayNextSFX()
    {
        AudioManager.instance.PlaySFX(AudioManager.instance.nextBtn);
    }
}
