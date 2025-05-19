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
    public bool DontForceUppercase;
    public bool ForceLowerCase;
    public bool IsValid => !string.IsNullOrEmpty(expectedInput) || (options != null && options.Count > 0 && !string.IsNullOrEmpty(correctOption));
    public bool CanType(string currentInput,Computer cpu)
    {
        return typed && !MatchLength(currentInput,cpu);
    }

    public bool HasOptions()
    {
        return options != null && options.Count > 0;
    }

    public bool Matches(string input, Computer cpu)
    {
        if (options != null && options.Count > 0)
        {
            return string.Equals(input.Trim(), correctOption, StringComparison.OrdinalIgnoreCase);
        }
        if (expectedInput == "#IS00")
            return input == cpu.GetMemoryRegister("#IS00");
        if (ContainsTags(expectedInput))
        {
            string regexPattern = ConvertTagsToRegex(expectedInput);
            return Regex.IsMatch(input, $"^{regexPattern}$");
        }

        return input == expectedInput;
    }
    public void SaveRegisters(InputComponent component)
    {
        string parsedInput = component.currentInput;
        component.inputData.ParseInput(ref parsedInput);

        string currentPassword = component.cpu.GetMemoryRegister("#IS00");

        foreach (var register in registers)
        {
            switch (register.direction)
            {
                case "#IS00":
                    component.cpu.SetMemoryRegister(parsedInput, "#IS00");
                    break;

                case "#NU00":
                    if (component.cpu.hardcodedNumberOneTime)
                        return;

                    component.cpu.hardcodedNumberOneTime = true;
                    // Añadir los dígitos del input en posiciones aleatorias dentro de la contraseña actual
                    List<char> resultNU = new List<char>(currentPassword);
                    foreach (char digit in parsedInput)
                    {
                        if (char.IsDigit(digit))
                        {
                            int insertPos = UnityEngine.Random.Range(0, resultNU.Count + 1);
                            resultNU.Insert(insertPos, digit);
                        }
                    }
                    string newNU = new string(resultNU.ToArray());
                    component.cpu.SetMemoryRegister(newNU, "#IS00");
                    break;

                case "#EX00":
                    string extra = parsedInput;
                    string newEX = currentPassword + extra;
                    component.cpu.SetMemoryRegister(newEX, "#IS00");
                    break;

                default:
                    if (!string.IsNullOrEmpty(register.content))
                    {
                        string D = register.content;
                        if (register.content == "#IS00") 
                        {
                            D = component.cpu.GetMemoryRegister(register.content);
                            char[] chars = D.ToCharArray();
                            chars[0] = char.ToUpper(chars[0]);
                            chars[chars.Length - 1] = char.ToUpper(chars[chars.Length - 1]);
                            string newMA = new string(chars);
                            component.cpu.SetMemoryRegister(newMA, "#IS00");
                            break;
                        }else
                            component.cpu.SetMemoryRegister(D, register.direction);
                    }
                    break;
            }
        }
    }

    public bool MatchLength(string input,Computer cpu)
    {
        if (options != null && options.Count > 0)
        {
            return input.Trim().Length == correctOption.Length;
        }
        if (expectedInput == "#IS00")
            return input.Length == cpu.GetMemoryRegister("#IS00").Length;
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

        // Contar longitudes estructurales
        MatchCollection matches = Regex.Matches(pattern, @"<(numbers|letters|any|special)=(\d+)>");
        foreach (Match match in matches)
        {
            if (int.TryParse(match.Groups[2].Value, out int value))
                length += value;
        }

        // Contar números añadidos
        Match addMatch = Regex.Match(pattern, @"<add='number',(\d+)>");
        if (addMatch.Success && int.TryParse(addMatch.Groups[1].Value, out int addCount))
            length += addCount;

        return length;
    }

    public void ApplyRegisters(InputComponent component)
    {
        // (Vacío por ahora, reservado para lógica futura)
    }

    public string GetDisplayInput(InputComponent component)
    {
        string start = startInput;
        string end = endInput;

        if (!string.IsNullOrEmpty(start) && start.StartsWith("#"))
            start = component.cpu.GetMemoryRegister(start);

        if (!string.IsNullOrEmpty(end) && end.StartsWith("#"))
            end = component.cpu.GetMemoryRegister(end);

        return start + " " + component.currentInput + typeEffect + " " + end;
    }

    private bool ContainsTags(string input)
    {
        return !string.IsNullOrEmpty(input) && input.Contains("<") && input.Contains("=");
    }

    public void ParseInput(ref string input)
    {
        if (!ContainsTags(expectedInput))
            return;

        string pattern = expectedInput;
        int pos = 0;
        string result = "";

        System.Random rng = new System.Random();

        // Procesar tags básicos
        MatchCollection matches = Regex.Matches(pattern, @"<(numbers|letters|any)=(\d+)>");
        foreach (Match match in matches)
        {
            string type = match.Groups[1].Value;
            int length = int.Parse(match.Groups[2].Value);

            for (int i = 0; i < length && pos < input.Length;)
            {
                char c = input[pos];
                bool valid = type switch
                {
                    "letters" => char.IsLetter(c),
                    "numbers" => char.IsDigit(c),
                    "any" => true,
                    _ => false
                };

                if (valid)
                {
                    result += c;
                    i++;
                }

                pos++;
            }
        }

        // <upper=X>
        MatchCollection upperTags = Regex.Matches(pattern, @"<upper=(-?\d+)>");
        foreach (Match upperMatch in upperTags)
        {
            int index = int.Parse(upperMatch.Groups[1].Value);
            int realIndex = index >= 0 ? index - 1 : result.Length + index;

            if (realIndex >= 0 && realIndex < result.Length)
            {
                char c = result[realIndex];
                result = result.Remove(realIndex, 1).Insert(realIndex, char.ToUpper(c).ToString());
            }
        }

        // <add='number',N>
        Match addMatch = Regex.Match(pattern, @"<add='number',(\d+)>");
        if (addMatch.Success)
        {
            int count = int.Parse(addMatch.Groups[1].Value);
            for (int i = 0; i < count; i++)
            {
                char randomDigit = (char)('0' + rng.Next(0, 10));
                int insertPos = rng.Next(0, result.Length + 1);
                result = result.Insert(insertPos, randomDigit.ToString());
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

        // NUEVO: validar caracteres especiales específicos
        converted = Regex.Replace(converted, @"<special=(\d+)>", m => $@"[@#$%&]{{{m.Groups[1].Value}}}");

        // Ignorar etiquetas de transformación visual/lógica
        converted = Regex.Replace(converted, @"<upper=-?\d+>", "");
        converted = Regex.Replace(converted, @"<add='number',\d+>", "");

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
