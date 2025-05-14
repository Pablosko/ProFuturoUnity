using UnityEngine;
[ExecuteAlways]
public class MatchParent : MonoBehaviour
{
    public bool heigth;
    public bool width;
    private RectTransform parent;

    private RectTransform rectTransform;

    void Awake()
    {
        if (transform.parent != null)
        parent = transform.parent.GetComponent<RectTransform>();
        rectTransform = GetComponent<RectTransform>();
    }

    void Update()
    {
        if (parent != null)
        {
            if (width) 
            {
                float childWidth = parent.rect.width;
                rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Horizontal, childWidth);
            }
            if (heigth) 
            {
                float childh = parent.rect.height;
                rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Vertical, childh);
            }
        }
    }
}
