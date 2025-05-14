using UnityEngine;

public class InpuKeyBoard : InputComponent
{
    public override void Start()
    {
        base.Start();
    }

    public override void Update()
    {
        base.Update();
        if (!IsActiveScreen() || !inputData.CanType(currentInput)) return;

        foreach (char c in Input.inputString)
        {
            // Retroceso
            if (c == '\b')
            {
                if (currentInput.Length > 0)
                {
                    currentInput = currentInput.Substring(0, currentInput.Length - 1);
                }
            }
            // Ignorar enter
            else if (c == '\n' || c == '\r')
            {
                continue;
            }
            else
            {
                char processedChar = char.IsLetter(c) ? char.ToUpper(c) : c;
                currentInput += processedChar;
            }
            inputData.ParseInput(ref currentInput);
            SetDataToScreen(currentInput); // SIEMPRE actualiza pantalla con todo el input actual
        }
    }

    private bool IsActiveScreen()
    {
        return inputData.IsValid;
    }
}
