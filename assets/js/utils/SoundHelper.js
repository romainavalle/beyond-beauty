import { Howl } from 'Howler'
import Emitter from '~/assets/js/events'
class SoundHelper {

  constructor () {
    this.mute = false
    this.volume = 1
    this.isBagroundSound = false
    this.isAppReady = false
    this.path = process.env.NODE_ENV === 'development' ? '/' : 'https://assets.beyond-beauty.co/'
  }

  load(){
    this.soundTop = new Howl({
      src: [`${this.path}sounds/master.mp3`],
      autoplay: false,
      volume: 0,
      loop: true,
      onload: () => {
        this.soundTopLoaded = true
        this.onSoundLoaded()
      },
      onend: () => {
        this.soundTop.seek(.55)
      }

    })
    this.soundBg = new Howl({
      src: [`${this.path}sounds/bg.mp3`],
      autoplay: false,
      volume: 0,
      loop: true,
      onload: () => {
        this.soundBgLoaded = true
        this.onSoundLoaded()
      },
      onend: () => {
        this.soundBg.seek(.55)
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
    if(!this.soundTopLoaded) return
    if(!this.soundBgLoaded) return
    if(!this.isAppReady) return
    this.soundTop.play()
    this.soundBg.play()
    if(this.soundTop)this.soundTop.fade(0, .2, 2000)
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
          this.isBagroundSound = false
          this.switchSound()
          Emitter.emit('SOUND_ENDED')
        }
      }
    })
    this.voice.on('play', ()=>{
      if(this.id === 'intro') {
        this.voice.volume(1)
      } else {
        this.voice.fade(0, 1, 1000)
        this.isBagroundSound = true
        this.switchSound()

      }
    })
  }
  toggleMute(mute) {
    this.mute = mute

    if(this.mute) {
      if(this.soundTop && !this.isBagroundSound)this.soundTop.fade(.2, 0, 300)
      if(this.soundBg && this.isBagroundSound)this.soundBg.fade(.2, 0, 300)
      if(this.voice)this.voice.fade(1, 0, 300)
    } else {
      if(this.soundTop && !this.isBagroundSound)this.soundTop.fade(0, .2, 300)
      if(this.soundBg && this.isBagroundSound)this.soundBg.fade(0, 1, 300)
      if(this.voice)this.voice.fade(0, 1, 300)
    }
  }
  switchSound() {
    if(this.isBagroundSound) {
      if(this.soundBg)this.soundBg.fade(0, .2, 1000)
      if(this.soundTop)this.soundTop.fade(.2, 0, 1000)
    }else{
      if(this.soundBg)this.soundBg.fade(.2, 0, 1000)
      if(this.soundTop)this.soundTop.fade(0, .2, 1000)

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
      this.voice.fade(0, 1, 300)
      this.isBagroundSound = true
      this.switchSound()
    }
  }
  pause() {
    if(!this.voice) return
    if(this.voice.playing()) {
      this.voice.fade(1, 0, 300)
      this.voice.once('fade', () => {
        this.voice.pause()
      });

      this.isBagroundSound = false
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
    this.voice.fade(1, 0, 1000)
    this.voice.once('fade', () => {
      this.voice.stop()
    });

    this.isBagroundSound = false
    this.switchSound()
  }
}

export default new SoundHelper()
