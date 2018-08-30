//Declare the img detection variable
var imgDetect;
imgDetect = {
  init: function (selector) {
    var _this = this,
        els = document.querySelectorAll(selector);
    [].forEach.call(els, function (el) {
      el.addEventListener('load', function () {
        _this.setAttributes(el);
      });
      
    });
  },
  helpers: {
    getRelativeBrightness: function (brightness) {
      return brightness > 125 ? 'imgDetect--lighter' : 'imgDetect--darker';
    },
    getRelativeColor:function (data) {
      var highClr = Math.max(data.r, data.g, data.b),
          color = '';
      console.log(data);
      switch (highClr) {
        case data.r:
          color = 'imgDetect--redder';
          break;
        case data.g:
          color = 'imgDetect--greener';
          break;
        case data.b:
          color = 'imgDetect--bluer';
        default:
          break;
      }
      return color;      
    }
  },
  CvsCtx: function (imgEl) {
      var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
      canvas.width = imgEl.width;
      canvas.height = imgEl.height;
      ctx.drawImage(imgEl,0,0);
      return ctx;
  },
  getData: function (imgEl) {
     var _this = imgDetect,
        ctx = _this.CvsCtx(imgEl),
        imageData = ctx.getImageData(0,0,imgEl.width,imgEl.height),
          data = imageData.data,
          colorSum = 0,
          imgData = {},
          r, g, b, avg, brightness;
      for(var x = 0, len = data.length; x < len; x+=4) {
        r = data[x];
        g = data[x+1];
        b = data[x+2];
        avg = Math.floor((r+g+b)/3);
        colorSum += avg;
      }
      imgData.r = r;
      imgData.g=  g;
      imgData.b = b;
      imgData.avg = avg;
      imgData.brightness = Math.floor(colorSum / (imgEl.width*imgEl.height));
      return imgData;
  },
  setClass: function (el, className) {
    el.classList.add(className);
  },

  setAttributes: function (imgEl) {
    var _this = imgDetect,
        data = _this.getData(imgEl);
    switch (imgEl.getAttribute('data-imgDetect')) {
      case 'parentClass':
        _this.setClass(imgEl.parentNode, 'brightness--' + data.brightness);
        _this.setClass(imgEl.parentNode, _this.helpers.getRelativeBrightness(data.brightness));
        _this.setClass(imgEl.parentNode, _this.helpers.getRelativeColor(data));
        break;
      case 'selfClass':
        _this.setClass(imgEl, 'brightness--' + data.brightness);
        _this.setClass(imgEl, _this.helpers.getRelativeBrightness(data.brightness));
        _this.setClass(imgEl, _this.helpers.getRelativeColor(data));


      default:
      break;
    }
  }
};
imgDetect.init('[data-imgDetect]');
/*
The MIT License (MIT)

Copyright (c) 2015 Ryan Goode, Martin Svetoslavov, Frank Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

