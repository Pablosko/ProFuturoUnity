using UnityEngine;

public class AudioManager : MonoBehaviour
{
    [Header("-------- Audio Source --------")]
    [SerializeField] AudioSource musicSource;
    [SerializeField] AudioSource SFXSource;

    [Header("-------- Audio Clip --------")]
    [Header("-------- Background --------")]
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

    private void Start()
    {
        musicSource.clip = tutorialBg;
        musicSource.volume = 0.3f;
        musicSource.Play();
    }
    public void PlayMusic(AudioClip clip, float volume = 1f)
    {
        musicSource.Stop();
        musicSource.clip = clip;
        musicSource.volume = volume;
        musicSource.Play();
    }

    public void PlaySFX(AudioClip clip, float volume = 1f) {
        SFXSource.volume = volume;
        SFXSource.PlayOneShot(clip);
    }
}
