using NUnit.Framework;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "Components", menuName = "Scriptable Objects/Components")]
public class ComponentsConfiguration : ScriptableObject
{
    public List<GameObject> components;
}
