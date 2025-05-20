using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;
public enum stageState 
{
    bloqued,
    unlocked,
    completed
}
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
    public int temario;
    public SubSequenceManager subsequenceManager;
    public stageState state;
    public GameObject completedImage;
    public GameObject aura;
    public Color completedColor;
    GameObject instancedMiniGame;
    bool canClick;

    void Awake()
    {
        Image img = GetComponent<Image>();
        img.alphaHitTestMinimumThreshold = 1;
        SetPlayerImage();
    }
    public void SetPlayerImage() 
    {
        playerAnim.gameObject.GetComponent<Image>().sprite = HudController.instance.header.spawnedAvatar;
    }
    public void SetComplete() 
    {
        state = stageState.completed;
        aura.SetActive(true);
        aura.GetComponent<Image>().color = completedColor;
        animator.SetBool("Completed", true);
        animator.SetBool("Blocked", false);
        animator.SetBool("Unlocked", false);
        completedImage.gameObject.SetActive(true);
    }
    public void StartSubSequence() 
    {
        subsequenceManager.StartSubSequence();
    }
    public void SetUnlocked() 
    {
        if (state != stageState.bloqued)
            return;
        state = stageState.unlocked;

        animator.SetBool("Completed", false);
        animator.SetBool("Blocked", false);
        animator.SetBool("Unlocked", true);
        completedImage.gameObject.SetActive(false);
    }
    public void MoveTo() 
    {
        navigateButton.interactable = false;
        Home.instance.MoveCameraToStage(this);
        startEvent?.Invoke();
    }
    public void SetNavigable(bool state) 
    {
        navigateButton.interactable = state;
        ClearPlayer();
    }
    public void SetBlocked() 
    {

        if (state != stageState.bloqued)
            return;
        state = stageState.bloqued;

        animator.SetBool("Completed", false);
        animator.SetBool("Blocked", true);
        animator.SetBool("Unlocked", false);
    }
    public void ArriveSite()
    {
        SetBlocked();
        playerAnim.SetTrigger("Alpha0to1");
        buttons.SetActive(true);
        canClick = true;

    }
    public void ClearPlayer() 
    {
        if (playerAnim.GetComponent<Image>().color.a == 1) 
            playerAnim.SetTrigger("Alpha1to0");
        buttons.SetActive(false);

    }
    public void BackToShip() 
    {
        ClearPlayer();
        Home.instance.MoveCameraToFullView();
    }
    public void GoToMinigame() 
    {
        if (!canClick)
            return;
        if (adventurePrefab == null)
            return;
        canClick = false;
        ClearPlayer();
        portalAnim.SetTrigger("portalSpawn");
        AudioManager.instance.PlaySFX(AudioManager.instance.portal);
        Invoke("DelayedCall", 2f);
    }
    public void DelayedCall()
    {
        buttons.SetActive(false);
        TransitionController.instance.PlayFadeOff();
        Invoke("DelayedDelayed", 0.5f);
    }
    public AventuraGrafica DelayedDelayed() 
    {
        canClick = true;
        instancedMiniGame = Instantiate(adventurePrefab, HudController.instance.stagesTransform);
        instancedMiniGame.SetActive(true);
        var aventura = instancedMiniGame.GetComponent<AventuraGrafica>();

        if(Home.instance != null)
        Home.instance.gameObject.SetActive(false);

        return aventura;
    }
}
