using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
[System.Serializable]
public struct SubSequenceData 
{
    public GameObject activationSequence;
    public List<GameObject> activeFalseSequences;
    public UnityEvent startSequenceEvents;
    public UnityEvent enSequenceEvents;
}

public class SubSequenceManager : MonoBehaviour
{
    public List<SubSequenceData> subsequences;
    public int index;
    public Transform movingTransform;
    public string id;
    void Start()
    {

    }
    public void InstantiteSubSequence() 
    {
        SCORMManager.instance.InitPage(id);
        GetCurrent().activationSequence.SetActive(true);
        GetCurrent().activationSequence.transform.SetParent(movingTransform);
        GetCurrent().activationSequence.GetComponent<SubSequence>().OnStart(this);

    }
    public void DeActivateSubSequences() 
    {
        foreach (GameObject subsq in GetCurrent().activeFalseSequences)
        {
            if (subsq == null)
                continue;
            subsq.SetActive(false);
            subsq.transform.SetParent(transform);

        }
    }

    public void StartSubSequence() 
    {
        InstantiteSubSequence();
        DeActivateSubSequences();
        GetCurrent().startSequenceEvents?.Invoke();

    }
    public void PrevSubSequence() 
    {
        if(index > 0)
            GetCurrent().activationSequence.SetActive(false);

        index--;
        if (index <= 0)
            index = 0;
    }
    public void NextSubSequence() 
    {
        index++;
        if (index >= subsequences.Count) 
        {
            EndSubSequence();
            return;
        }

        StartSubSequence();
    }
    public void EndSubSequence() 
    {
        SCORMManager.instance.EndPage(id);
        GetCurrent().enSequenceEvents?.Invoke();
        ResetSubSequence();
        gameObject.SetActive(false);

    }
    public SubSequenceData GetCurrent() 
    {
        return subsequences[index];
    }
    public void ResetSubSequence() 
    {
        DestroyAllSubSequences();
        index = 0;
    }
    public void DestroyAllSubSequences() 
    {
        foreach (var subseq in subsequences)
        {
            subseq.activationSequence.SetActive(false);
            subseq.activationSequence.transform.SetParent(transform);

        }
    }
}
