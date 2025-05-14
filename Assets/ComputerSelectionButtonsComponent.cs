using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ComputerSelectionButtonsComponent : InputComponent
{
    [System.Serializable]
    public class OptionButton
    {
        public Button button;
        public TextMeshProUGUI label;
    }

    [Header("Botones preinstanciados desde el editor")]
    public List<OptionButton> buttons;

    public override void SetScreenData(ComputerScreenAsset screenData)
    {
        base.SetScreenData(screenData);
        currentInput = ""; // limpiar al cargar

        bool hasOptions = inputData.options != null && inputData.options.Count > 0;

        for (int i = 0; i < buttons.Count; i++)
        {
            OptionButton optionBtn = buttons[i];

            if (hasOptions && i < inputData.options.Count)
            {
                string optionText = inputData.options[i];

                optionBtn.label.text = optionText;
                optionBtn.button.gameObject.SetActive(true);
                optionBtn.button.interactable = true;

                optionBtn.button.onClick.RemoveAllListeners();
                optionBtn.button.onClick.AddListener(() => OnOptionSelected(optionText));
            }
            else
            {
                optionBtn.button.gameObject.SetActive(false);
                optionBtn.button.interactable = false;
            }
        }
    }

    public override void SetRefreshFeedBack(ComputerScreenAsset screenData)
    {
        base.SetRefreshFeedBack(screenData);
    }

    private void OnOptionSelected(string selectedOption)
    {
        currentInput = selectedOption;
        cpu.LoadNext();
    }
    public override bool IsBlocked()
    {
        return currentInput == "" && buttons[0].button.interactable == true;
    }
    public override bool IsInputCorrect()
    {
        return inputData.Matches(currentInput);
    }
   
}
