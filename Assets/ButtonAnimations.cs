using UnityEngine;

[RequireComponent(typeof(Animator))]
[RequireComponent(typeof(CanvasGroup))]
public class ButtonAnimations : MonoBehaviour
{
    Animator animator;
    public bool spawnStart = true;
    private void Awake()
    {
        animator = GetComponent<Animator>();
    }
    public void SpawnAnimation() 
    {
        animator.SetTrigger("Spawn");
    }
    private void OnEnable()
    {
        if (spawnStart)
            SpawnAnimation();
    }
    void Start()
    {
   
    }

    void Update()
    {
        
    }
}
