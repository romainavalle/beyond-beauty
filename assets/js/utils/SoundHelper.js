import { Howl } from 'Howler'
import Emitter from '~/assets/js/events'
class SoundHelper {

  constructor () {
    this.mute = false
  }
  createSound(id, part) {
    this.id = id
    const partTxt = part != undefined ? `-${part}` : ''
    if(this.sound)this.sound.unload()
    const path = process.env.NODE_ENV === 'dev' ? '/' : ''
    this.sound = new Howl({
      src: `${path}sounds/${id}${partTxt}.mp3`,
      autoplay: !this.mute,
      volume: 0,
      onload: () => {
        Emitter.emit('SOUND_LOADED')
      },
      onend: () => {
        if(this.id !== 'intro') Emitter.emit('SOUND_ENDED')
      }

    })
    this.sound.on('play', ()=>{
      if(this.id === 'intro') {
        this.sound.volume(1)
      } else {
        this.sound.fade(0, 1, 1000)
      }
    })
  }
  toggleMute(mute) {
    this.mute = mute
    if(this.mute) this.pause()
  }
  isPlaying() {
    return this.sound.playing()
  }
  playPause() {
    if(this.mute) return
    if(this.sound.playing()) {
      this.pause()
    } else {
      this.sound.play()
      this.sound.fade(0, 1, 300)
    }
  }
  pause() {
    if(!this.sound) return
    if(this.sound.playing()) {
      this.sound.fade(1, 0, 300)
      this.sound.once('fade', () => {
        this.sound.pause()
      });
    }
  }
  getPos() {
    return this.sound.seek()
  }
  getDuration() {
    return this.sound.duration()
  }
  fadeOut() {
    if(!this.sound) return
    if(this.sound.volume() !== 1) return
    this.sound.fade(1, 0, 1000)
    this.sound.once('fade', () => {
      this.sound.stop()
    });
  }
}

export default new SoundHelper()
