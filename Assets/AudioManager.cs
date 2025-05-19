using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Audio;
using Random = UnityEngine.Random;

public class AudioManager : MonoBehaviour
{
    public static AudioManager instance;

    [Header("-------- Audio Mixer --------")]
    public AudioMixer audioMixer;

    [Header("-------- Audio Source --------")]
    [SerializeField] private AudioSource musicSource;
    [SerializeField] private AudioSource SFXSource;

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

    public void PlayMusic(AudioClip clip, float volume = 1f)
    {
        if (clip == null) return;

        musicSource.Stop();
        musicSource.clip = clip;
        musicSource.volume = volume;
        musicSource.Play();
    }

    public void PlaySFX(AudioClip clip, float volume = 1f)
    {
        if (clip == null) return;
        StartCoroutine(PlaySFXWhenReady(clip, volume));
    }
    public void PlaySFX(AudioClip clip, float minp, float maxp,float volume = 1f)
    {
        if (clip == null) return;
        StartCoroutine(PlaySFXWhenReady(clip, volume,minp,maxp));
    }

    public void PlaySFXLoop(AudioClip clip, float volume = 1f)
    {
        if (clip == null) return;
        StartCoroutine(PlaySFXLoopWhenReady(clip, volume));
    }

    public void StopFX()
    {
        SFXSource.Stop();
        SFXSource.loop = false;
        SFXSource.pitch = 1f;
    }

    public void SetMasterVolume(float volume)
    {
        float v = Mathf.Log10(Mathf.Clamp(volume, 0.0001f, 1f)) * 20f;
        audioMixer.SetFloat("MasterVolume", Mathf.Clamp(v, -80f, 0f));
    }

    // ----------- CORUTINAS -----------

    private IEnumerator PlaySFXWhenReady(AudioClip clip, float volume)
    {
        yield return null;
        if (!clip.loadInBackground && clip.loadState != AudioDataLoadState.Loaded)
            clip.LoadAudioData(); // ⚠️ importante: fuerza la carga si aún no está cargado

        float timeout = 2f;
        float timer = 0f;

        while (clip.loadState == AudioDataLoadState.Loading)
        {
            if (timer >= timeout)
            {
                Debug.LogWarning($"[AudioManager] ❌ El clip '{clip.name}' no se cargó a tiempo.");
                yield break;
            }

            timer += Time.unscaledDeltaTime;
            yield return null;
        }

        if (clip.loadState != AudioDataLoadState.Loaded)
        {
            Debug.LogWarning($"[AudioManager] ❌ El clip '{clip.name}' no pudo cargarse (estado: {clip.loadState}).");
            yield break;
        }

        SFXSource.pitch = Random.Range(0.9f, 1.1f);
        SFXSource.volume = volume;
        SFXSource.PlayOneShot(clip);
    }

    private IEnumerator PlaySFXWhenReady(AudioClip clip, float volume,float minp,float maxp)
    {
        yield return null;
        if (!clip.loadInBackground && clip.loadState != AudioDataLoadState.Loaded)
            clip.LoadAudioData(); // ⚠️ importante: fuerza la carga si aún no está cargado

        float timeout = 2f;
        float timer = 0f;

        while (clip.loadState == AudioDataLoadState.Loading)
        {
            if (timer >= timeout)
            {
                Debug.LogWarning($"[AudioManager] ❌ El clip '{clip.name}' no se cargó a tiempo.");
                yield break;
            }

            timer += Time.unscaledDeltaTime;
            yield return null;
        }

        if (clip.loadState != AudioDataLoadState.Loaded)
        {
            Debug.LogWarning($"[AudioManager] ❌ El clip '{clip.name}' no pudo cargarse (estado: {clip.loadState}).");
            yield break;
        }

        SFXSource.pitch = Random.Range(minp, maxp);
        SFXSource.volume = volume;
        SFXSource.PlayOneShot(clip);
    }
    private IEnumerator PlaySFXLoopWhenReady(AudioClip clip, float volume)
    {
        yield return null;
        if (!clip.loadInBackground && clip.loadState != AudioDataLoadState.Loaded)
            clip.LoadAudioData();

        float timeout = 2f;
        float timer = 0f;

        while (clip.loadState == AudioDataLoadState.Loading)
        {
            if (timer >= timeout)
            {
                Debug.LogWarning($"[AudioManager] ❌ El clip LOOP '{clip.name}' no se cargó a tiempo.");
                yield break;
            }

            timer += Time.unscaledDeltaTime;
            yield return null;
        }

        if (clip.loadState != AudioDataLoadState.Loaded)
        {
            Debug.LogWarning($"[AudioManager] ❌ El clip LOOP '{clip.name}' no pudo cargarse.");
            yield break;
        }

        SFXSource.loop = true;
        SFXSource.pitch = Random.Range(0.85f, 1.2f);
        SFXSource.clip = clip;
        SFXSource.volume = volume;
        SFXSource.Play(); // 🔄 Usar Play(), no PlayOneShot(), para loop
    }



}
