using JetBrains.Annotations;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Home : MonoBehaviour
{
    public RectTransform contentContainer; // 🔲 Contenedor a mover y escalar
    public float duration = 0.5f;
    public List<HomeStageUI> homeStagesUI;
    public static Home instance;
    public List<GameObject> SequenceManagers;
    public SubSequenceManager hardcodedTema6;
    private Coroutine currentCoroutine;
    public int currentStage = 0;

    private void Awake()
    {
        instance = this;
        gameObject.SetActive(false);
    }
    public void OnEnable()
    {
        SetStageUnlocks();
    }
    public void SetStageUnlocks() 
    {
        SetNavegableState(false);
        for (int i = 0; i < currentStage; i++)
        {
            CompleteStage(i + 1);
        }
    }
    public void StartStage(int stage)
    {
        if (stage >= 7)
            return;
        currentStage = stage;
        if (stage == 6) 
            homeStagesUI[0].BackToShip();
        else
            homeStagesUI[stage - 1].BackToShip();
        SequenceManager sq = Instantiate(SequenceManagers[stage - 1], HudController.instance.stagesTransform).GetComponent<SequenceManager>();
        sq.GetComponent<RectTransform>().position = Vector3.zero;
        sq.GetComponent<RectTransform>().localScale = Vector3.one;
        sq.LoadFirstSequence();
    }
    public void StartStageSubSequence(int stage) 
    {
        if (stage == 6)
            hardcodedTema6.StartSubSequence();
        else
            homeStagesUI[stage - 1].StartSubSequence();
    }
    public void SetNavegableState(bool state) 
    {
        foreach (HomeStageUI stageUI in homeStagesUI)
        {
            stageUI.SetNavigable(state);
        }
    }
    public void UnlockStage(int stage)
    {
        currentStage = stage;
        homeStagesUI[stage - 1].SetUnlocked();
        homeStagesUI[stage - 1].SetNavigable(true);
    }
    public void CompleteStage(int stage)
    {
        homeStagesUI[stage - 1].SetComplete();
        homeStagesUI[stage - 1].SetNavigable(true);
    }

    public void MoveCameraToStage(HomeStageUI stage)
    {
        SetNavegableState(false);
        FocusOnElement(stage, duration);
    }

    public void MoveCameraToFullView()
    {
        if (currentCoroutine != null)
            StopCoroutine(currentCoroutine);
        SetNavegableState(true);
        currentCoroutine = StartCoroutine(ResetCameraView(duration));
    }

    public void FocusOnElement(HomeStageUI stage, float duration)
    {
        if (contentContainer == null || stage.cameraTravel == null)
        {
            Debug.LogWarning("❌ Contenedor o target no asignado.");
            return;
        }

        if (currentCoroutine != null)
            StopCoroutine(currentCoroutine);

        currentCoroutine = StartCoroutine(FocusRoutine(contentContainer, stage, duration));
    }

    private IEnumerator FocusRoutine(RectTransform container, HomeStageUI stage, float duration)
    {
        RectTransform targetElement = stage.cameraTravel;
        float zoomFactor = stage.zoomFactor;

        Vector2 startPos = container.anchoredPosition;
        float startScale = container.localScale.x;
        float endScale = zoomFactor;

        float elapsed = 0f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = Mathf.SmoothStep(0f, 1f, elapsed / duration);
            float currentScale = Mathf.Lerp(startScale, endScale, t);
            container.localScale = Vector3.one * currentScale;

            // Recalcular posición en cada frame debido al escalado dinámico
            Vector2 localTargetPos = container.InverseTransformPoint(targetElement.position);
            Vector2 targetPos = -(localTargetPos * currentScale);

            container.anchoredPosition = Vector2.Lerp(startPos, targetPos, t);

            yield return null;
        }

        container.localScale = Vector3.one * endScale;

        Vector2 finalLocalTargetPos = container.InverseTransformPoint(targetElement.position);
        Vector2 finalTargetPos = -(finalLocalTargetPos * endScale);
        container.anchoredPosition = finalTargetPos;

        stage.ArriveSite();
    }

    private IEnumerator ResetCameraView(float duration)
    {
        Vector2 startPos = contentContainer.anchoredPosition;
        float startScale = contentContainer.localScale.x;

        Vector2 endPos = Vector2.zero;
        float endScale = 1f;

        float elapsed = 0f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = Mathf.SmoothStep(0f, 1f, elapsed / duration);

            contentContainer.anchoredPosition = Vector2.Lerp(startPos, endPos, t);
            contentContainer.localScale = Vector3.Lerp(Vector3.one * startScale, Vector3.one * endScale, t);

            yield return null;
        }

        contentContainer.anchoredPosition = endPos;
        contentContainer.localScale = Vector3.one;
    }
}
