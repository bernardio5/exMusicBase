

// take a noteList, a time span, canvas, position, etc
// draw a staff and the notes in that time span. 


var note = require('./note');
var noteList = require('.noteList');
var exTabDisplay = require('./exTabDisplay'); 

//////////////////////////////////// PageTabDisplay: as TabDisplay, but still

function exPageTabDisplay(aCanvas, aTimer, aTuning) {
   this.canvas = aCanvas; 
    this.context = aCanvas.getContext("2d");
        
    this.context.fillStyle = 'white';
    this.context.strokeStyle = "#000";
    this.cxw = this.context.canvas.width; 
    this.cxh = this.context.canvas.height; 
    
    this.timer = aTimer; 

    this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = "tabTiles01.png"; 
    that = this;
    this.tiles.onload: function(that) { that.loaded=1; }
    this.tileSize = 16;    // size of tiles on screen; set how you please
    this.imgTileSz = 32;    // sze of tiles in tabTiles01: 32
    this.tileW = this.tileSize / this.cxw; 
    this.tileH = this.tileSize / this.cxh; 
}


// will JS use the this of exTabDisplay, or of exPageTabDisplay??  it's an experiment! 
exPageTabDisplay.prototype.drawMinSprite =        exTabDisplay.prototype.drawMinSprite;
exPageTabDisplay.prototype.drawSliderSprite =     exTabDisplay.prototype.drawSliderSprite;
exPageTabDisplay.prototype.drawLargeSprite =      exTabDisplay.prototype.drawLargeSprite;
exPageTabDisplay.prototype.drawStretchedSprite =  exTabDisplay.prototype.drawStretchedSprite;
exPageTabDisplay.prototype.clear =                exTabDisplay.prototype.clear;

// given a MIDI tone and a place on the measures, draw. 
exPageTabDisplay.prototype.drawPluck: function(string, fret, tm, ppn, bx, by) { 
    var t0,mi,bpms,px,py,tx,ty; 
    
    t0 = this.timer.lastMeasureTime;
    mi = this.timer.measureInterval; 
    bi = this.timer.beatInterval; 
    bpms = this.timer.beatsPerMeasure; 

    px = (((tm-t0)/mi)*bpms);
    if ((px>=-0.01)&&(px<=(2.99*bpms))) {
        if (px>=((bpms*2)-0.1)) {
            px +=1.0; 
        }
        if (px>=(bpms-0.1)) {
            px += 2.2; 
        } else {
            px += 1.2; 
        } 
        py = 6-string; 

        // get the fret and string of the note-- without moving your hand
        tx = fret; 
        ty = 0; 
        this.drawMinSprite(px,py, tx,ty); 
    }
}


// given a MIDI tone and a place on the measures, draw. 
exPageTabDisplay.prototype.drawStaff: function(noteList, measureStart) { 
    var i, p, x, plusx, perc, bpm, nc, mstart, bt, intv; 

    this.clear(); 
    bpm = this.timer.beatsPerMeasure; 


    // draw three measures of tab
    this.drawLargeSprite(0,1, 3,1, 1,6); //xy txy sxy  left bar
    this.drawLargeSprite(bpm+1,1, 3,1, 1,6); //xy txy sxy  rt bar
    this.drawLargeSprite((bpm*2)+2,1, 3,1, 1,6); //xy txy sxy  rt bar

    this.drawStretchedSprite(1,1, 1,1, 1,6, bpm,1); // vert bar on left
    this.drawStretchedSprite(2+bpm,1, 1,1, 1,6, bpm,1); // on mid
    this.drawStretchedSprite(3+(bpm*2),1, 1,1, 1,6, bpm,1); // on rt

    this.drawLargeSprite(1,0, 0,8, bpm,1); // beats ticks above left
    this.drawLargeSprite(2+bpm,0, 0,8, bpm,1); // above mid
    this.drawLargeSprite(3+(bpm*2),0, 0,8, bpm,1); // above rt

    // draw the miniscore at the bottom. instead of one sprite/beat, 
    // vertical scale is 8 px/beat
    

    // plucks!
    for (i=0; i<noteList.length(); i=i+1) {
        p = noteList.nth(i); 
        this.drawPluck(p.string, p.fret, p.t, 8.0);
    }

}



