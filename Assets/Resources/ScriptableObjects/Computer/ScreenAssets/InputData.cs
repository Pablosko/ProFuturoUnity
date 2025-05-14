using System;
using System.Text.RegularExpressions;
using System.Collections.Generic;

[Serializable]
public struct InputData
{
    [Serializable]
    public class Register
    {
       public string content;
       public string direction;
    }
    public string expectedInput;
    public string startInput;
    public string endInput;
    public bool capped;

    public List<string> options;
    public List<Register> registers;
    public string correctOption;
    public bool typed;
    public string typeEffect;
    public bool alwaysPass;

    public bool IsValid => !string.IsNullOrEmpty(expectedInput) || (options != null && options.Count > 0 && !string.IsNullOrEmpty(correctOption));
    public bool CanType(string currentInput)
    {
        return typed && !MatchLength(currentInput);
    }
    public bool HasOptions() 
    {
        return options.Count > 0;
    }
    public bool Matches(string input)
    {
        if (options != null && options.Count > 0)
        {
            return string.Equals(input.Trim(), correctOption, StringComparison.OrdinalIgnoreCase);
        }

        if (ContainsTags(expectedInput))
        {
            string regexPattern = ConvertTagsToRegex(expectedInput);
            return Regex.IsMatch(input, $"^{regexPattern}$");
        }

        return input == expectedInput;
    }
    public void SaveRegisters(InputComponent component)
    {
        foreach (Register register in registers)
        {
            if (register.direction == "#IS00")
                register.content = component.currentInput;
            component.cpu.SetMemoryRegister(register.content, register.direction);
        }
    }
    public bool MatchLength(string input)
    {
        if (options != null && options.Count > 0)
        {
            return input.Trim().Length == correctOption.Length;
        }

        if (ContainsTags(expectedInput))
        {
            int expectedLength = ExtractExpectedLengthFromTags(expectedInput);
            return input.Length == expectedLength;
        }

        return input.Length == expectedInput.Length;
    }
    private int ExtractExpectedLengthFromTags(string pattern)
    {
        int length = 0;

        MatchCollection matches = Regex.Matches(pattern, @"<(numbers|letters|any)=(\d+)>");

        foreach (Match match in matches)
        {
            if (int.TryParse(match.Groups[2].Value, out int value))
            {
                length += value;
            }
        }

        return length;
    }
    public void ApplyRegisters(InputComponent component) 
    {

    }
    public string GetDisplayInput(InputComponent component)
    {
        string start = startInput;
        if (startInput == "#IS00")
            start = component.cpu.GetMemoryRegister("#IS00");
        return start + " " + component.currentInput + typeEffect+" " + endInput;
    }

    private bool ContainsTags(string input)
    {
        return input.Contains("<") && input.Contains("=");
    }
    public void ParseInput(ref string input)
    {
        if (!ContainsTags(expectedInput))
            return;

        string pattern = expectedInput;
        int pos = 0;
        string result = "";

        // Encuentra todos los tags en orden
        MatchCollection matches = Regex.Matches(pattern, @"<(numbers|letters|any)=(\d+)>");

        foreach (Match match in matches)
        {
            string type = match.Groups[1].Value;
            int length = int.Parse(match.Groups[2].Value);

            for (int i = 0; i < length && pos < input.Length;)
            {
                char c = input[pos];

                bool valid = false;
                switch (type)
                {
                    case "letters":
                        if (char.IsLetter(c)) valid = true;
                        break;
                    case "numbers":
                        if (char.IsDigit(c)) valid = true;
                        break;
                    case "any":
                        valid = true;
                        break;
                }

                if (valid)
                {
                    result += c;
                    i++; // solo avanza si el carácter es válido
                }

                pos++;
            }
        }

        input = result;
    }

    private string ConvertTagsToRegex(string pattern)
    {
        string converted = pattern;
        converted = Regex.Replace(converted, @"<numbers=(\d+)>", m => $@"\d{{{m.Groups[1].Value}}}");
        converted = Regex.Replace(converted, @"<letters=(\d+)>", m => $@"[a-zA-Z]{{{m.Groups[1].Value}}}");
        converted = Regex.Replace(converted, @"<any=(\d+)>", m => $@".{{{m.Groups[1].Value}}}");
        return converted;
    }
    public void SetInputEffect() 
    {
        typeEffect = "_";
    }
    public void RemoveInputEffect()
    {
        typeEffect = "<color=#00FFFF00>_</color>";
    }
}
