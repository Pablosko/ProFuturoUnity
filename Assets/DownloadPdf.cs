using System.IO;
using UnityEngine;

public class DownloadPdf : MonoBehaviour
{
    public string pdf;
    public void DownloadPDF() 
    {
        SCORMManager.instance.DownloadPDF(pdf);
    }
}
