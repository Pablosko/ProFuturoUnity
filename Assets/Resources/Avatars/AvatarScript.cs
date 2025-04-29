using UnityEngine;

[CreateAssetMenu(fileName = "AvatarScript", menuName = "Scriptable Objects/Avatar")]
public class AvatarScript : ScriptableObject
{
    public string avatarName;
    [TextArea(5,20)]
    public string info;
    public Sprite fullSprite;
    public Sprite headerSprite;
}
