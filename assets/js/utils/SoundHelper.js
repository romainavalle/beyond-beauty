import { Howl } from 'Howler'
import { pages } from '~/assets/data.json'
import Emmiter from '~/assets/js/events'
class SoundHelper {

  constructor () {
  }
  createSound(id, part) {
    if(this.sound)this.sound.unload()
    this.sound = new Howl({
      src: `/sounds/${id}-${part}.mp3`,
      autoplay: true,
      volume: 1,
      onload: function() {
        Emmiter.emit('SOUND_LOADED')
      },
      onend: function() {
        console.log('Finished!');
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
