using UnityEngine;
using UnityEngine.Events;

public class TransitionController : MonoBehaviour
{
    public static TransitionController instance;
    public UnityEvent action;
    private void Awake()
    {
        instance = this;
    }
    public Animator animator;
    public void PlayFadeOff() 
    {
        animator.SetTrigger("FadeOff");
    }
    public void TransitionEvent() 
    {
        action?.Invoke();
    }
}
