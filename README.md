# Tridion Developer Summit 2015 Slideshow

## Installation

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
* any code needs to be in the `pre` element. Give it a class name that 

### Navigation, Title
For right now, you will need to edit `assets/templates/shell.html`. 
It contains a section for your navigation. 

Each list item in the slide navigation contains a link. Set that link to correspond to the id in your slide if you want to be able to skip to specific slides in your navigation. 


