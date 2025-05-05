using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class LoadEffect : MonoBehaviour
{
    public float fakeLoadTime = 0.5f; // Tiempo total de carga simulada
    public TextMeshProUGUI text;      // Texto donde mostrar el progreso
    public SequenceBase sequence;
    private float timer;
    private bool isLoading;
    public Image fillImage;
    void Start()
    {
        isLoading = true;
    }

    void Update()
    {
        if (isLoading)
        {
            timer += Time.deltaTime;
            float progress = Mathf.Clamp01(timer / fakeLoadTime);
            int percent = Mathf.RoundToInt(progress * 100f);
            text.text = percent + "%";
            fillImage.fillAmount = progress;
            if (progress >= 1f)
            {
                isLoading = false;
                text.text = "100%";
                sequence?.End();
            }
        }
    }

    public void End()
    {
        // Inicia la simulación de carga
        timer = 0f;
        isLoading = true;
        text.text = "0%";
    }
}
