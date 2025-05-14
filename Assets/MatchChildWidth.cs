using UnityEngine;

[ExecuteAlways]
public class MatchChildWidth : MonoBehaviour
{
    private RectTransform childToMatch;

    private RectTransform rectTransform;

    void Awake()
    {
        childToMatch = transform.GetChild(0).GetComponent<RectTransform>();
        rectTransform = GetComponent<RectTransform>();
    }

    void Update()
    {
        if (childToMatch != null)
        {
            float childWidth = childToMatch.rect.width;
            rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Horizontal, childWidth);
        }
    }
}
