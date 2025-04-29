using UnityEngine;

public class MiniGameTrasform : MonoBehaviour
{
    public static MiniGameTrasform instance;
    private void Awake()
    {
        instance = this;
    }
    public void StartMiniGame(GameObject prefab)
    {
        if (prefab != null)
        {
            GameObject instancemini = Instantiate(prefab,transform);
            instancemini.SetActive(true);
        }
    }
}
