using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class SequenceManager : MonoBehaviour
{
    public List<GameObject> sequences;
    [HideInInspector]
    public SequenceBase currentSequence;
    public int sequenceIndex;
    public GameObject endStageActivationGo;
    public UnityEvent endActions;

    void Start()
    {
        LoadFirstSequence();
    }
    public void LoadFirstSequence() 
    {
        if (currentSequence != null)
            Destroy(currentSequence);
        sequenceIndex = 0;
        StartCurrentSequence();
    }
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
            currentSequence.End();
    }
    public void End() 
    {
        gameObject.SetActive(false);
        if(endStageActivationGo != null)
        endStageActivationGo.SetActive(true);
        endActions?.Invoke();
    }
    public void NextSequence() 
    {
        sequenceIndex++;

        if (IsLastSequence()) 
        {
            End();
            return;
        }
        StartCurrentSequence();
    }
    public void StartCurrentSequence() 
    {
        if (sequenceIndex >= sequences.Count) 
        {
            End();
            return;
        }
        currentSequence = Instantiate(sequences[sequenceIndex], transform).GetComponent<SequenceBase>();
        currentSequence.OnStart(this);

    }
 
    public bool IsLastSequence() 
    {
        return sequenceIndex >= sequences.Count;
    }
    public void SpawnMinigame(GameObject prefab) 
    {
        MiniGameTrasform.instance.StartMiniGame(prefab);
    }
    public void StartSubSequences(int index) 
    {
        Home.instance.StartStageSubSequence(index);
    }
    
}

