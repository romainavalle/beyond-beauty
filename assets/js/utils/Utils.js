
class Utils {

  shuffle(array) {
    let j, x, i;
    for (i = array.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
    return array
  }

  getYoutubeId(url) {
    let name = 'v';
    if (!url) {
      url = window.location.href;
    }

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  getVimeoId(link){
    let videoLink_array = link.split('/')
    return videoLink_array[videoLink_array.length - 1]
  }

  setCookie(cookiename, value, hours = 12) {
    var date = new Date();
    date.setTime(date.getTime() + Number(hours) * 3600 * 1000);
    document.cookie = cookiename + "=" + value + "; path=/;expires = " + date.toGMTString();
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  checkFileSize(file) {
    var isFileSizeOk = true
    let fileSize = Math.ceil(file.size * 100 / (1024 * 1024)) / 100
    if (fileSize > this.maxVideoSize) {
      //alert('the file is to large (max : ' + this.maxVideoSize + 'Mo)')
      isFileSizeOk = false
    }
    return isFileSizeOk
  }

  checkFileExtension(file, el) {
    let acceptAttr = el.accept.split(',')
    var isFileExtOk = false
    var filename_array = file.name.split('.')
    var ext = '.' + filename_array[filename_array.length - 1].toLowerCase()
    acceptAttr.forEach((attr) => {
      if (ext === attr) isFileExtOk = true
    })
    //if (!isFileExtOk) alert('wrong file format (' + ext + ') ' + acceptAttr.join(''))
    return isFileExtOk
  }

  isTouchDevice() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  offset(element){
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    }
  }
}

export default new Utils();
