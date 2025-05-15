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
        if (!IsActiveScreen()) return;

        foreach (char c in Input.inputString)
        {
            bool isBackspace = c == '\b';

            // Solo permitir tecleo si CanType o si es retroceso
            if (!inputData.CanType(currentInput, cpu) && !isBackspace)
                continue;

            if (isBackspace)
            {
                if (currentInput.Length > 0)
                {
                    currentInput = currentInput.Substring(0, currentInput.Length - 1);
                }
            }
            else if (c == '\n' || c == '\r')
            {
                continue; // Ignorar enter
            }
            else
            {
                char processedChar = c;

                if (char.IsLetter(c) && !inputData.DontForceUppercase)
                {
                    processedChar = char.ToUpper(c);
                }

                currentInput += processedChar;
            }

            // Siempre aplicar parseo y actualizar pantalla
            inputData.ParseInput(ref currentInput);
            SetDataToScreen(currentInput);
        }
    }


    private bool IsActiveScreen()
    {
        return inputData.IsValid;
    }
}
