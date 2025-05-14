using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class WindowComponent : Component
{
    public Transform programsTabParent;
    public GameObject programTabPrefab;
    public Color active;
    public Color completed;
    public Color unlocked;

    private WindowTab[] tabCollection;  // Cache de tabs
    private Program[] programCache;     // Cache de programas

    public override void Initialize(Computer computer)
    {
        base.Initialize(computer);

        // Limpia tabs antiguos
        foreach (Transform child in programsTabParent)
            Destroy(child.gameObject);

        int programCount = computer.programs.Count;
        tabCollection = new WindowTab[programCount];
        programCache = new Program[programCount];

        for (int i = 0; i < programCount; i++)
        {
            Program prog = computer.programs[i];
            GameObject tabObj = Instantiate(programTabPrefab, programsTabParent);
            WindowTab tab = tabObj.GetComponent<WindowTab>();
            tab.SetData(prog.programName);

            tabCollection[i] = tab;
            programCache[i] = prog;
        }

        SetStates(computer.GetCurrentProgram().programName);
    }

    public override void SetScreenData(ComputerScreenAsset screenData)
    {
        base.SetScreenData(screenData);
    }

    public void SetStates(string currentProgramName)
    {
        int currentIndex = -1;

        // Localiza índice actual
        for (int i = 0; i < programCache.Length; i++)
        {
            if (programCache[i].programName == currentProgramName)
            {
                currentIndex = i;
                break;
            }
        }

        for (int i = 0; i < programCache.Length; i++)
        {
            var prog = programCache[i];
            var tab = tabCollection[i];

            if (i == currentIndex)
            {
                tab.UpdateState(active);
            }
            else if (i < currentIndex)
            {
                tab.UpdateState(prog.CanProgress() ? unlocked : completed);
            }
            else // i > currentIndex
            {
                tab.UpdateState(unlocked);
            }
        }
    }
}
