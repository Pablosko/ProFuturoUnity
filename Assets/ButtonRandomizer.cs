using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ButtonRandomizer : MonoBehaviour
{
    public List<Button> buttons;
    private List<RectTransform> transforms = new List<RectTransform>();
    private List<Vector3> originalPositions = new List<Vector3>();
    private void Start()
    {
    }
    public void InitStartingTransforms()
    {
        transforms.Clear();
        originalPositions.Clear();

        foreach (Button b in buttons)
        {
            RectTransform rt = b.GetComponent<RectTransform>();
            transforms.Add(rt);
            originalPositions.Add(rt.anchoredPosition); // anchoredPosition is used for UI layout
        }
    }

    public void RandimzeAll()
    {
        if (originalPositions.Count == 0)
        {
            InitStartingTransforms();
        }

        // Create a shuffled copy of the positions
        List<Vector3> shuffledPositions = new List<Vector3>(originalPositions);
        Shuffle(shuffledPositions);

        // Apply the shuffled positions
        for (int i = 0; i < transforms.Count; i++)
        {
            transforms[i].anchoredPosition = shuffledPositions[i];
        }
    }

    public void ResetPositions()
    {
        if (originalPositions.Count == 0)
        {
            InitStartingTransforms();
        }

        for (int i = 0; i < transforms.Count; i++)
        {
            transforms[i].anchoredPosition = originalPositions[i];
        }
    }

    private void Shuffle<T>(List<T> list)
    {
        for (int i = list.Count - 1; i > 0; i--)
        {
            int j = Random.Range(0, i + 1);
            (list[i], list[j]) = (list[j], list[i]); // swap
        }
    }
}
