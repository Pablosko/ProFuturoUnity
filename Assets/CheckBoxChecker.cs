using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CheckBoxChecker : MonoBehaviour
{
    public GameObject checkBoxObject;
    public Transform verticalLayoutTransform;

    public int startNumber;
    int done = 0;
    [TextArea(3, 5)]
    public List<string> checkBoxes;
    public Button passButton;
    private void Start()
    {
        GenerateBoxes();
        AddCheck(0);
    }

    public void GenerateBoxes() 
    {
        int index = 0;
        foreach (string s in checkBoxes)
        {
            GameObject cb = Instantiate(checkBoxObject, verticalLayoutTransform);
            cb.GetComponent<CheckBoxItem>().SetData(index + startNumber, s,this);
            index++;
             
        }
    }
    public void AddCheck(int number) 
    {
        done += number;
        passButton.enabled = CheckAll();
    }
    public bool CheckAll() 
    {
        return done >= checkBoxes.Count;
    }
}
