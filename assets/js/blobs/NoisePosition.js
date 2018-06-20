import SimplexNoise from 'simplex-noise'

class NoisePosition {
  constructor() {
    this.totalPoints = 40
    this.noiseValues = []
    this.time = 0
    this.init()
  }

  init(){
    this.noise = new SimplexNoise(Math.random())
    // console.log(this.noiseValues, this.getValuesFrom(20))
  }

  tick() {
    this.time++
    let angle = 0
    const slice = Math.PI * 2 / this.totalPoints
    let x = 0, y = 0, displacement = 0
    this.noiseValues = []
    for(let i = 0; i < this.totalPoints; i++) {
      x = Math.cos(angle)
      y = Math.sin(angle)
      displacement =  (this.noise.noise3D(x, y, this.time * 0.005) * 5)
      this.noiseValues.push({x: x * displacement, y: y * displacement})
      angle += slice
    }
  }

  getValuesFrom(id) {
    const end = this.noiseValues.slice(0, id)
    const begin = this.noiseValues.slice(id)
    return [...begin, ...end]
  }
}









export default new NoisePosition()
