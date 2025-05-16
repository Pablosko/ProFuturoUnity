using System.IO;
using UnityEngine;

public class DownloadPdf : MonoBehaviour
{
    public void DownloadPDF() 
    {
        SCORMManager.instance.DownloadPDF("PDF-T5-5.1.6");
    }
}
