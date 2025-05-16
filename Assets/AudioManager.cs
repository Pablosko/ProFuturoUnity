using System;
using UnityEngine;
using UnityEngine.Audio;
using Random = UnityEngine.Random;
public class AudioManager : MonoBehaviour
{
    public static AudioManager instance;

    [Header("-------- Audio Mixer --------")]
    public AudioMixer audioMixer; 

    [Header("-------- Audio Source --------")]
    [SerializeField] AudioSource musicSource;
    [SerializeField] AudioSource SFXSource;

    [Header("-------- Background Music --------")]
    public AudioClip tutorialBg;
    public AudioClip storytellingBg;
    public AudioClip minigameBg;

    [Header("-------- Tutorial --------")]
    public AudioClip avatarChange;
    public AudioClip avatarSelect;
    public AudioClip spaceship;
    public AudioClip nextBtn;
    public AudioClip prevBtn;

    [Header("-------- Home --------")]
    public AudioClip portal;

    [Header("-------- Block 1 --------")]
    public AudioClip storytellingFbKo;
    public AudioClip storytellingFbOk;

    [Header("-------- CardGame --------")]
    public AudioClip minigameCardSlide;
    public AudioClip minigameFbOk;
    public AudioClip minigameFbKo;

    [Header("-------- EXTRAS --------")]
    public AudioClip winMedal;

    private void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }

    private void Start()
    {
    }

    public void PlayMusic(AudioClip clip, float volume = 1f)
    {
        musicSource.Stop();
        musicSource.clip = clip;
        musicSource.volume = volume;
        musicSource.Play();
    }

    public void PlaySFX(AudioClip clip, float volume = 1f)
    {
        SFXSource.pitch = Random.Range(0.9f, 1.1f); // Variación leve de pitch
        SFXSource.volume = volume;
        SFXSource.PlayOneShot(clip);
    }

    public void PlaySFXLoop(AudioClip clip, float volume = 1f)
    {
        SFXSource.loop = true;
        SFXSource.pitch = Random.Range(0.85f, 1.2f);
        SFXSource.clip = clip;
        SFXSource.volume = volume;
        SFXSource.Play();
    }

    public void StopFX()
    {
        SFXSource.Stop();
        SFXSource.loop = false;
        SFXSource.pitch = 1f;
    }

    public void SetMasterVolume(float volume)
    {
        float v = Mathf.Log10(volume) * 20;
        audioMixer.SetFloat("MasterVolume", Mathf.Clamp(v, -80, 0)); // dB scale
    }
}