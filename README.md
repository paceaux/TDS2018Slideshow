# Tridion Developer Summit 2015 Slideshow

## Installation

 * This was developed in NPM ^3.0, you may get installation errors if you run `npm install` without upgrading *

* Download the package
* run `npm install`
* present from presentation.html
* use a node module such as http-server to run a quick local server and present


## Editing

### Slides
Add your slides in the `slides/` folder. they will go into your presentation alphabetically, so either start the file with a name, or use the scheme that you see in there. 

You are in charge of the content inside of the slide:
* the `id` of the `header` element is the friendly URL to your slide
* put all of your content inside of `<div id="slide__content">`
* you may have multiple `slide__content`s in a slider. This is your vertical scrolling
* any code needs to be in the `pre` element with the class `prettyprint` Give it a class name that represents the language: `prettyprint lang-css`

### Slide effects
If you want an effect on a piece of content, add one of these as the value of a `data-fx` attribute on the element:

* slidefromleft
* slidefromright
* fadein
* fadeout
* callout
* grow
* shrink
* sizebounce

### Navigation, Title
For right now, you will need to edit `assets/templates/shell.html`. 
It contains a section for your navigation. 

Each list item in the slide navigation contains a link. Set that link to correspond to the id in your slide if you want to be able to skip to specific slides in your navigation. 

It's a bit manual at the moment. Sorry :(


## presenting
### Targeted browser/device
This was built to be used on the surface pro 3, or an iPad. It fits on tablet sizes screens and uses touch events. 

This also uses the CSS flexbox module pretty heavily; It is not supported in any version of IE below 10. May also not work in older versions of the Android browser, either. 

### User controls ####
 * left/right arrows for next, previous slide (or swipe on a touch device)
 * up/down arrows for next, previous content within slide (or swipe on touch device)
 *  <kbd>ctrl</kbd> + <kbd>i</kbd> toggles full width agenda
 *  <kbd>ctrl</kbd> + <kbd>s</kbd> toggles full width slides
 *  <kbd>ctrl</kbd> + <kbd>f</kbd> toggles fullscreen viewing
 *  <kbd>`</kbd> or <kbd>tab</kbd> takes you to your next effect within a slide panel
 *  <kbd>ctrl</kbd> + <kbd>f</kbd> toggles fullscreen viewing
