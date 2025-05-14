using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class WindowTab : MonoBehaviour
{
    public TextMeshProUGUI text;
    public Image image;
    public void SetData(string data) 
    {
        text.text = data;
    }
    public void UpdateState(Color color) 
    {
        image.color = color;   
    }

}
