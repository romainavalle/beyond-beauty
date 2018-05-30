import MMUnpacker from 'mm-unpacker'
class ToolsUnpacker {

  constructor () {
    this.unpacker =  null
    this.init()
  }
  init(){
    console.log('t')
  }
  setDatas(image, datas){
    console.log(datas)
  }
  unpack(image, datas){
    this.unpacker = new MMUnpacker(image, datas);
  }
}

export default new ToolsUnpacker()
