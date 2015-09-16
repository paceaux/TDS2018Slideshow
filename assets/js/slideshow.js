/*===============
    #PROTOTYPEMODS
===============*/
HTMLElement.prototype.removeClassByPartialName = function (partialName) {
    var classArray = this.className.split(' '), el = this;
    classArray.forEach(function(elClassName, i) {
        if (elClassName.indexOf(partialName) !== -1) {
            el.className = el.className.replace(elClassName,'');
        }
    });
    el.className = el.className.replace(/\s+/g," ");
};
/*===============
    #SLIDESHOW
===============*/
var slideshow = slideshow || {};
slideshow.namespace = function(ns_string) {
    var parts = ns_string.split('.'),
        parent = slideshow,
        i;
    if (parts[0] === "slideshow") {
        parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

/*==========
    #INIT
==========*/

slideshow.namespace('init');
slideshow.init = function() {
    for (var module in this.modules) {
        console.log(module);
        if (this.modules[module].hasOwnProperty('init')) {
            this.modules[module].init();
        }
    }
    prettyPrint();
};
slideshow.namespace('info');
slideshow.info = (function () {
    var getBreakpoint = function () {
        return window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
    }
    return {
        breakpoint : (function () {
            return getBreakpoint();
        })()
    }
})();

/*================
    #MODULES
===============*/



/*================
    #Navigation
===============*/

slideshow.namespace('modules.navigation');
slideshow.modules.navigation = (function () {
    var public = {},
        currentSlideIndex = 0,  
        getSlideArray, evtCbs,moveHelpers, showSlide, init;

    getSlideArray = function () {
       return  document.querySelectorAll('.slide');
    };
    function setupSlides () {
        var slides = getSlideArray();
        for (var i=0,panels, slide; i< slides.length; i++) {
            slide = slides[i];
            panels = slide.querySelectorAll('.slide__content');
            slide.querySelector('.js-slideNum').innerHTML = (i + 1) + ' of ' + slides.length;
            slide.id = 'js-slide--' + i;
            slide.classList.add('js-slide--' + i);
            slide.dataset.slideindex = i;
            slide.dataset.panelcount = panels.length;
            for (var n=0, panel; n < panels.length; n++) {
                panel = panels[n];
               // panel.id = slide.id + '-panel--' + n;
                panel.classList.add('js-panel--' + n);
                if (n === 0) {
                    panel.classList.add('ui-visible');
                }
            }
            if (i === 0) {
                slide.classList.add('ui-current');
                currentSlideIndex = i;
            }

        }
    };

    showSlide = {
        currentSlide: 0,
        gotoSlide : function (i) {
            var rootSlide = document.querySelector('.slides .slide'),
                articleWidth = rootSlide.offsetWidth + rootSlide.style.marginRight,
                currentSlide = document.getElementById('js-slide--' + i),
                currentPanel = currentSlide.querySelector('.slide__content');
            rootSlide.style.marginLeft = 0 - (articleWidth * i) + 'px';
            document.querySelector('.ui-current').classList.remove('ui-current');
            currentSlide.classList.add('ui-current');
            currentPanel.classList.add('ui-visible');
            history.pushState(currentSlide.dataset.title, "slide " + i, '#' + currentSlide.dataset.title.replace(' ', '-'));
            slideshow.modules.navigation.view.currentPanel = 0;

        },
        next: function () {
            if (this.currentSlide < slideshow.modules.navigation.getSlideCount-1) this.currentSlide++;
            this.gotoSlide(this.currentSlide);
        },
        prev: function () {
            if (this.currentSlide > 0) this.currentSlide--;
            this.gotoSlide(this.currentSlide)
        }
    };
    showPanel = {
        currentPanel: 0,
        panelCount: function () {
            var currentSlide = document.querySelector('.ui-current');
            return parseInt(currentSlide.dataset.panelcount, 10);
        },
        gotoPanel: function (i) {
            var currentSlide = document.querySelector('.ui-current'),
                hiddenTopPaneli = i > 0 ? i-1 : 0,
                hiddenBottomPaneli = i < this.panelCount() ? i + 1 : this.panelCount(), 
                currentPanel = currentSlide.querySelector('.js-panel--' + i),
                hiddenTopPanel = currentSlide.querySelector('.js-panel--' + hiddenTopPaneli);
            hiddenTopPanel.classList.add('ui-hiddenTop');
            hiddenTopPanel.classList.remove('ui-visible');
            currentPanel.classList.remove('ui-hiddenTop');
            currentPanel.classList.add('ui-visible');
        },
        next: function () {
            if (this.currentPanel < this.panelCount() -1 ) this.currentPanel++;
            this.gotoPanel(this.currentPanel);

        },
        prev: function () {
            var currentSlide = document.querySelector('.ui-current');
            if (this.currentPanel > 0) {
                this.currentPanel--;
                currentSlide.querySelector('.ui-visible').classList.remove('ui-visible');
            };
            this.gotoPanel(this.currentPanel);

        }
    };
    evtCbs = {

        keyup: function (e) {
            e.preventDefault();
            switch (e.which) {
                case 37:
                //left
                slideshow.modules.navigation.navigate.next();
                break;
                case 39:
                //right
                slideshow.modules.navigation.navigate.prev();
                break;
                case 38: 
                //up
                slideshow.modules.navigation.view.prev();
                break;
                case 40: 
                //down
                var thisSlide = document.querySelector('.ui-current'),
                    thisPanel = thisSlide.querySelector('.ui-visible');
                if (thisPanel.querySelector('[data-fx]')) {
                    slideshow.modules.ui.showEffect();
                } else {
                    slideshow.modules.navigation.view.next();

                }
                break;
                default:
                break;
            }
        },
        navClick: function (e) {
            e.preventDefault();
            var slides = document.querySelector('.slides'),
                humanID = e.target.href.slice(e.target.href.indexOf('#')).replace('#',''),
                targetSlide = slides.querySelector('#'+humanID).parentNode,
                targetIndex = targetSlide.dataset.slideindex;

            slideshow.modules.navigation.navigate.gotoSlide(targetIndex);
            history.pushState(null,null,'#'+humanID);
            console.log(humanID, targetIndex);
        }
    };
    function bindUiEvts () {
        window.addEventListener('keyup', evtCbs.keyup);
        [].forEach.call(document.querySelectorAll('[contenteditable]'), function (el) {
            el.addEventListener('keyup', function (e) {
                e.stopPropagation();
            });
        });
        [].forEach.call(document.querySelectorAll('.slideNav .list__item__link'), function (navLink) {
            navLink.addEventListener('click', evtCbs.navClick);
        });
        var slides = document.querySelector('.slides'),
            body = document.querySelector('body'),
            hslides = new Hammer(slides),
            hbody = new Hammer(body);
        hslides.on('swipeleft', function (e) {
            slideshow.modules.navigation.navigate.next();
        });
        hslides.on('swiperight', function (e) {
            slideshow.modules.navigation.navigate.prev();
        });
        hslides.on('pandown', function (e) {
            slideshow.modules.navigation.view.prev();
        });
        hslides.on('panup', function (e) {
            slideshow.modules.navigation.view.next();
        });

    };
    init = function( ) {
        setupSlides();
        bindUiEvts();
    };
    init();
    public = {
        evtCbs: evtCbs,
        slides: getSlideArray(),
        getSlideCount: getSlideArray().length,
        navigate: showSlide,
        view: showPanel,
        currentSlide : currentSlideIndex   
    }
    return public;

})();

/*================
    #NavBuilder
===============*/
slideshow.namespace('modules.navBuilder');
slideshow.modules.navBuilder = (function () {
    var navContainer = document.querySelector('.slideNav'),
        getSlideArray, navItemArray,navItem, init, evtCbs;

    getSlideArray = function () {
       return  document.querySelectorAll('.slide');
    };
    evtCbs = {
        navItemClick: function (e) {
            e.preventDefault();

        }
    };

    navItem = function (slide) {
        var slideLink = document.createElement('a'),
            clonedSlide = slide.cloneNode(true);

        slideLink.href = "#"+ slide.id;
        slideLink.classList.add('slideNav__link');
        clonedSlide.id = '';
        slideLink.appendChild(clonedSlide);

        slideLink.addEventListener('click', evtCbs.navItemClick,false);
        return slideLink;
    };

    function bindUiEvts() {

    };
    function init() {
        //setupNavItems();
        bindUiEvts();
    };
    init();
    return {};
})();

/*================
    #UIControls
===============*/
slideshow.namespace('modules.ui');
slideshow.modules.ui = (function () {
    var public = {}, evtCbs = {};

    public.toggleSidebar = function () {
        var sidebar = document.querySelector('.slideNav');
        sidebar.classList.toggle('ui-collapsed');
    };
    public.toggleMain = function () {
        var sidebar = document.querySelector('.slideNav');
        sidebar.classList.toggle('ui-expandedfull');
    };
    public.toggleFullscreen= function () {
          if (!document.fullscreenElement &&    // alternative standard method
              !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
              document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
              document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            }
          }

    };
    public.showEffect = function () {
        var currentSlide = document.querySelector('.slide.ui-current'),
            currentPanel = currentSlide.querySelector('.ui-visible'),
            fxItem = currentPanel.querySelector('[data-fx]');
        fxItem.classList.add('fx-' + fxItem.dataset.fx);
        fxItem.removeAttribute('data-fx');
    };
    evtCbs = {
        shortKey: function (e) {
            switch (e.which) {
                case 187:
                //=
                e.preventDefault()
                slideshow.modules.ui.showEffect();
                break;
                case 192:
                //`
                slideshow.modules.ui.showEffect();
                break;
                default: 
                break;
            }
            if (e.ctrlKey) {
                switch (e.which) {
                    case 73:
                    //i
                    slideshow.modules.ui.toggleMain();
                    break;
                    case 70:
                    //f
                    slideshow.modules.ui.toggleFullscreen();
                    break;
                    case 83:
                    //s
                    slideshow.modules.ui.toggleSidebar();
                    break;
                    case 78:
                    slideshow.modules.ui.toggleSidebar();
                    //n
                    break;
                    default: 
                    break;
                }
            }
        },
        pushHash: function (e) {
            console.log(e);

        }
    };
    function setupFadeEffects() {
        var fadeLists = document.querySelectorAll('ul[data-fx], ol[data-fx]');
        [].forEach.call(fadeLists, function(fadeList) {
            var effect = fadeList.dataset.fx,
                listItems = fadeList.querySelectorAll('li');
            [].forEach.call(listItems, function(listItem) {
                listItem.dataset.fx = effect;
            });
            fadeList.removeAttribute('data-fx');
        });
    }
    function bindUiEvts() {
        var nav = document.querySelector('.slideNav'),
            hNav = new Hammer(nav);

        hNav.on('swipeleft', function (e) {
            slideshow.modules.ui.toggleSidebar();
        });
        hNav.on('swiperight', function (e) {
            slideshow.modules.ui.toggleSidebar();
        });
        hNav.add(new Hammer.Tap({event: 'doubletap', taps: 2}));
        hNav.on('doubletap', function (e) {
            slideshow.modules.ui.toggleSidebar();
        });
        window.addEventListener('keyup', evtCbs.shortKey);
        window.addEventListener('hashchange', evtCbs.pushHash);
        //to do: add in the history API, Hash by titles or slide number
    };
    function init() {
        setupFadeEffects();
        bindUiEvts();
    }
    init();
    return public;
})();

slideshow.init();