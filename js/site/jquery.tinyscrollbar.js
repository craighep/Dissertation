/*! tinyscrollbar - v2.2.5 - 2015-01-14
 * http://www.baijs.com/tinyscrollbar
 *
 * Copyright (c) 2015 Maarten Baijs <wieringen@gmail.com>;
 * Licensed under the MIT license */

!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){"use strict";function b(b,e){function f(){return o.update(),h(),o}function g(){t.css(y,o.thumbPosition),q.css(y,-o.contentPosition),r.css(x,o.trackSize),s.css(x,o.trackSize),t.css(x,o.thumbSize)}function h(){u?p[0].ontouchstart=function(a){1===a.touches.length&&(a.stopPropagation(),k(a.touches[0]))}:(t.bind("mousedown",function(a){a.stopPropagation(),k(a)}),s.bind("mousedown",function(a){k(a,!0)})),a(window).resize(function(){o.update("relative")}),o.options.wheel&&window.addEventListener?b[0].addEventListener(v,l,!1):o.options.wheel&&(b[0].onmousewheel=l)}function i(){return o.contentPosition>0}function j(){return o.contentPosition<=o.contentSize-o.viewportSize-5}function k(b,c){o.hasContentToSroll&&(a("body").addClass("noSelect"),z=c?t.offset()[y]:w?b.pageX:b.pageY,u?(document.ontouchmove=function(a){(o.options.touchLock||i()&&j())&&a.preventDefault(),m(a.touches[0])},document.ontouchend=n):(a(document).bind("mousemove",m),a(document).bind("mouseup",n),t.bind("mouseup",n),s.bind("mouseup",n)),m(b))}function l(c){if(o.hasContentToSroll){var d=c||window.event,e=-(d.deltaY||d.detail||-1/3*d.wheelDelta)/40,f=1===d.deltaMode?o.options.wheelSpeed:1;o.contentPosition-=e*f*o.options.wheelSpeed,o.contentPosition=Math.min(o.contentSize-o.viewportSize,Math.max(0,o.contentPosition)),o.thumbPosition=o.contentPosition/o.trackRatio,b.trigger("move"),t.css(y,o.thumbPosition),q.css(y,-o.contentPosition),(o.options.wheelLock||i()&&j())&&(d=a.event.fix(d),d.preventDefault())}}function m(a){if(o.hasContentToSroll){var c=w?a.pageX:a.pageY,d=u?z-c:c-z,e=Math.min(o.trackSize-o.thumbSize,Math.max(0,o.thumbPosition+d));o.contentPosition=e*o.trackRatio,b.trigger("move"),t.css(y,e),q.css(y,-o.contentPosition)}}function n(){o.thumbPosition=parseInt(t.css(y),10)||0,a("body").removeClass("noSelect"),a(document).unbind("mousemove",m),a(document).unbind("mouseup",n),t.unbind("mouseup",n),s.unbind("mouseup",n),document.ontouchmove=document.ontouchend=null}this.options=a.extend({},d,e),this._defaults=d,this._name=c;var o=this,p=b.find(".viewport"),q=b.find(".overview"),r=b.find(".scrollbar"),s=r.find(".track"),t=r.find(".thumb"),u="ontouchstart"in document.documentElement,v="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll",w="x"===this.options.axis,x=w?"width":"height",y=w?"left":"top",z=0;return this.contentPosition=0,this.viewportSize=0,this.contentSize=0,this.contentRatio=0,this.trackSize=0,this.trackRatio=0,this.thumbSize=0,this.thumbPosition=0,this.hasContentToSroll=0,this.update=function(a){var b=x.charAt(0).toUpperCase()+x.slice(1).toLowerCase();switch(this.viewportSize=p[0]["offset"+b],this.contentSize=q[0]["scroll"+b],this.contentRatio=this.viewportSize/this.contentSize,this.trackSize=this.options.trackSize||this.viewportSize,this.thumbSize=Math.min(this.trackSize,Math.max(this.options.thumbSizeMin,this.options.thumbSize||this.trackSize*this.contentRatio)),this.trackRatio=(this.contentSize-this.viewportSize)/(this.trackSize-this.thumbSize),this.hasContentToSroll=this.contentRatio<1,r.toggleClass("disable",!this.hasContentToSroll),a){case"bottom":this.contentPosition=Math.max(this.contentSize-this.viewportSize,0);break;case"relative":this.contentPosition=Math.min(Math.max(this.contentSize-this.viewportSize,0),Math.max(0,this.contentPosition));break;default:this.contentPosition=parseInt(a,10)||0}return this.thumbPosition=this.contentPosition/this.trackRatio,g(),o},f()}var c="tinyscrollbar",d={axis:"y",wheel:!0,wheelSpeed:40,wheelLock:!0,touchLock:!0,trackSize:!1,thumbSize:!1,thumbSizeMin:20};a.fn[c]=function(d){return this.each(function(){a.data(this,"plugin_"+c)||a.data(this,"plugin_"+c,new b(a(this),d))})}});