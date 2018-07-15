import { Howl } from 'Howler'
import Emitter from '~/assets/js/events'
class SoundHelper {

  constructor () {
    this.mute = false
    this.volume = 1
    this.isBackgroundSound = false
    this.isAppReady = false
    this.path = process.env.NODE_ENV === 'development' ? '/' : 'https://assets.beyond-beauty.co/'
  }

  load(){
    this.soundPiano = new Howl({
      src: [`${this.path}sounds/piano.mp3`],
      autoplay: false,
      loop: true,
      volume: .2,
      onload: () => {
        this.soundPianoLoaded = true
        this.onSoundLoaded()
      },
      onend: () => {
        //this.soundPiano.seek(.55)
      }

    })
    this.soundBg = new Howl({
      src: [`${this.path}sounds/bg.mp3`],
      autoplay: false,
      loop: true,
      volume: .2,
      onload: () => {
        this.soundBgLoaded = true
        this.onSoundLoaded()
      },
      onend: () => {
        //this.soundBg.seek(.55)
      }

    })
  }
  onReady() {
    setTimeout(()=>{
      this.isAppReady = true
      this.onSoundLoaded()
    }, 1300)
  }
  onSoundLoaded(){
    if(!this.soundPianoLoaded) return
    if(!this.soundBgLoaded) return
    if(!this.isAppReady) return
    this.soundPiano.play()
    this.soundBg.play()
    if(this.soundPiano)this.soundPiano.fade(0, .2 * this.volume, 2000)
  }
  createSound(id, part) {
    this.id = id
    const partTxt = part != undefined ? `-${part}` : ''
    if(this.voice)this.voice.unload()
    this.voice = new Howl({
      src: `${this.path}sounds/${id}${partTxt}.mp3`,
      autoplay: true,
      volume: 0,
      onload: () => {
        Emitter.emit('SOUND_LOADED')
      },
      onend: () => {
        if(this.id !== 'intro') {
          this.isBackgroundSound = false
          this.switchSound()
          this.voice.off()
          Emitter.emit('SOUND_ENDED')
        }
      }
    })
    this.voice.on('play', ()=>{
      if(this.id === 'intro') {
        this.voice.volume(1)
      } else {
        this.voice.fade(0, 1 * this.volume, 1000)
        this.isBackgroundSound = true
        this.switchSound()

      }
    })
  }
  toggleMute(mute) {
    this.mute = mute

    if(this.mute) {
      this.volume = 0
      if(this.soundPiano)this.soundPiano.fade(.2 * this.volume, 0, 300)
      if(this.soundBg)this.soundBg.fade(.2 * this.volume, 0, 300)
      if(this.voice)this.voice.fade(1 * this.volume, 0, 300)
    } else {
      this.volume = 1
      if(this.soundBg)this.soundBg.fade(0, .2 * this.volume, 300)
      if(this.soundPiano && !this.isBackgroundSound)this.soundPiano.fade(0, .2 * this.volume, 300)
      if(this.voice)this.voice.fade(0, 1 * this.volume, 300)
    }
  }
  switchSound() {

    if(this.isBackgroundSound) {
      if(this.soundPiano)this.soundPiano.fade(.2 * this.volume, 0, 1000)
    }else{
      if(this.soundPiano)this.soundPiano.fade(0, .2 * this.volume, 1000)

    }
  }
  isPlaying() {
    return this.voice.playing()
  }
  playPause() {
    if(this.voice.playing()) {
      this.pause()
    } else {
      this.voice.play()
      this.voice.fade(0, 1 * this.volume, 300)
      this.isBackgroundSound = true
      this.switchSound()
    }
  }
  pause() {
    if(!this.voice) return
    if(this.voice.playing()) {
      this.voice.fade(1 * this.volume, 0, 300)
      this.voice.once('fade', () => {
        this.voice.pause()
      });

      this.isBackgroundSound = false
      this.switchSound()
    }
  }
  getPos() {
    return this.voice.seek()
  }
  getDuration() {
    return this.voice.duration()
  }
  fadeOut() {
    if(!this.voice) return
    if(this.voice.volume() !== 1) return
    this.voice.fade(1 * this.volume, 0, 1000)
    this.voice.once('fade', () => {
      this.voice.stop()
    });

    this.isBackgroundSound = false
    this.switchSound()
  }
}

export default new SoundHelper()
