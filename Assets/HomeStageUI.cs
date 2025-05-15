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
    public Animator portalAnim;
    public GameObject buttons;
    public GameObject adventurePrefab;
    public Button navigateButton;
    public UnityEvent startEvent;
    public GameObject miniGame;
    public GameObject aura;
    public int temario;
    public SubSequenceManager subsequenceManager;
    AudioManager audioManager;

    void Awake()
    {
        Image img = GetComponent<Image>();
        img.alphaHitTestMinimumThreshold = 1;
        SetPlayerImage();
        audioManager = GameObject.FindGameObjectWithTag("Audio").GetComponent<AudioManager>();
    }
    public void SetPlayerImage() 
    {
        playerAnim.gameObject.GetComponent<Image>().sprite = HudController.instance.header.spawnedAvatar;
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
        if (!HudController.instance.header.HasMedal(temario))
            return;
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
        portalAnim.SetTrigger("portalSpawn");
        audioManager.PlaySFX(audioManager.portal);
        Invoke("DelayedCall", 2f);
    }
    public void DelayedCall()
    {
        buttons.SetActive(false);
        TransitionController.instance.PlayFadeOff();
        Invoke("DelayedDelayed", 0.5f);
    }
    public void DelayedDelayed() 
    {
        GameObject instance = Instantiate(adventurePrefab, HudController.instance.stagesTransform);
        instance.SetActive(true);
        var aventura = instance.GetComponent<AventuraGrafica>();


        Home.instance.gameObject.SetActive(false);
    }
}
