using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public class HomeStageUI : MonoBehaviour
{
    public RectTransform cameraTravel;
    public Image effectImge;
    public float zoomFactor;
    public Animator animator;
    public Animator playerAnim;
    public GameObject buttons;
    public GameObject adventurePrefab;
    public Button navigateButton;
    public UnityEvent startEvent;
    public GameObject miniGame;
    public GameObject aura;
    public int temario;
    public SubSequenceManager subsequenceManager;
    void Awake()
    {
        Image img = GetComponent<Image>();
        img.alphaHitTestMinimumThreshold = 1;
    }
    public void StartSubSequence() 
    {
        subsequenceManager.StartSubSequence();
    }
    public void SetClickable() 
    {
        animator.SetBool("Clickable", true);
        animator.SetBool("Unlocked", false);
        aura.SetActive(true);

    }
    public void MoveTo() 
    {
        Home.instance.MoveCameraToStage(this);
        startEvent?.Invoke();
    }
    public void SetNavigable(bool state) 
    {
        navigateButton.enabled = state;
    }
    public void SetUnlock() 
    {
        animator.SetBool("Clickable", false);
        animator.SetBool("Unlocked", true);
        animator.StopPlayback();
        effectImge.color = new Color(0, 0, 0, 0);
    }
    public void ArriveSite()
    {
        SetUnlock();
        playerAnim.SetTrigger("Alpha0to1");
        buttons.SetActive(true);

    }
    public void BackToShip() 
    {
        buttons.SetActive(false);
        playerAnim.SetTrigger("Alpha1to0");
        Home.instance.MoveCameraToFullView();
    }
    public void GoToMinigame() 
    {
        if (adventurePrefab == null)
            return;
        playerAnim.SetTrigger("Alpha1to0");
        Invoke("DelayedCall", 1.2f);
    }
    public void DelayedCall()
    {
        buttons.SetActive(false);

        GameObject instance = Instantiate(adventurePrefab, HudController.instance.transform);
        instance.SetActive(true);
        var aventura = instance.GetComponent<AventuraGrafica>();
      

        Home.instance.gameObject.SetActive(false);
    }
}
