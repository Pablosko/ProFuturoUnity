using System;
using System.Collections.Generic;
using Unity.VisualScripting.Antlr3.Runtime.Tree;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.UI;

public class ScreenNavigation : Component
{
    public Button continueButton;
    public Button backButton;
    [HideInInspector] public List<ActivationObject> progressionObjects = new();

    public Transform dotsTransform;
    public GameObject dotPrefab;
    public Animator animator;
    public override void Start()
    {
        base.Start();
    }

    public override void Initialize(Computer computer)
    {
        base.Initialize(computer);
        cpu = computer;

    }
    public override void SetScreenData(ComputerScreenAsset screenData)
    {
        base.SetScreenData(screenData);
        GenerateProgressionDots();
    }
    public override void RefreshState()
    {
        base.RefreshState();
        backButton.interactable = cpu.HasPrev();
        continueButton.interactable = cpu.CanProgress() || cpu.GetCurrentScreen().HasOptions;
        animator.SetBool("Active", cpu.CanProgress());
    }
    public void GenerateProgressionDots()
    {
        // Asegura que la lista esté limpia
        progressionObjects.RemoveAll(obj => obj == null);

        for (int i = progressionObjects.Count; i < cpu.GetCurrentProgram().screens.Count; i++)
        {
            GameObject go = Instantiate(dotPrefab, dotsTransform);
            progressionObjects.Add(go.GetComponent<ActivationObject>());
        }

        CheckProgresionFeedback();
    }
    public void CheckProgresionFeedback()
    {
        for (int i = 0; i < progressionObjects.Count; i++)
        {
            progressionObjects[i].SetState(i == cpu.index);
        }
    }
    public void Next() 
    {
        cpu.LoadNext();
    }
    public void Prev() 
    {
        cpu.LoadPrev();
    }
}
