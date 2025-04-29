using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "TagConfigs", menuName = "Scriptable Objects/TagConfigs")]
public class TagConfigs : ScriptableObject
{
    [System.Serializable]
    public class ColorTag
    {
        public string tagName = "yellow"; // e.g. "yellow"
        public Color color = Color.yellow;
    }

    public List<ColorTag> tags = new();

    public string GetHexFromTag(string tag)
    {
        foreach (var t in tags)
        {
            if (t.tagName.ToLower() == tag.ToLower())
                return ColorUtility.ToHtmlStringRGB(t.color);
        }
        return null;
    }
}
