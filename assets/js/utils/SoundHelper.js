import { Howl } from 'Howler'
import Emmiter from '~/assets/js/events'
class SoundHelper {

  constructor () {
  }
  createSound(id, part) {
    if(this.sound)this.sound.unload()
    const path = process.env.NODE_ENV === 'dev' ? '/' : ''
    this.sound = new Howl({
      src: `${path}sounds/${id}-${part}.mp3`,
      autoplay: true,
      volume: 1,
      onload: function() {
        Emmiter.emit('SOUND_LOADED')
      },
      onend: function() {
        Emmiter.emit('SOUND_ENDED')
      }

    })
  }
  getPos() {
    return this.sound.seek()
  }
  getDuration() {
    return this.sound.duration()
  }


}

export default new SoundHelper()
