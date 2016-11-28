

// WTF fix this shit. use exSpriteCanvas!



// score.js lets you make a sheet of music, tab or clef. 

// the standard canvas should be 1024x640. Sprites are 16x16. 
// that gives 64x40 sprites. Tab lines are 7 sprites tall; clef lines are 




////////////////// exScoreLine draws part of a score somewhere, in clef, tab, whatever. 
// mainly needed, at this time, to know what part of the score to draw on a line. 
// to know this, the line needs to know its width, duration per width, and which line it is.

// score is an exNoteList. 
// line is an exLine-- notelists contain nothing about measures. 

var note = require('./exNote');
var noteList = require('.exNoteList');


function exLineTab(aCanvas, score, line, secPerTile, whichLine) {
	this.ox = 0; // origin
	this.oy = 0; 

	this.myCanvas = aCanvas; 
	this.score = exNoteList; 

	// really, Neal-- reload the sprites per line? eh. 
	this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = "tabTiles01.png"; 
    that = this;
    this.tiles.onload = function(that) { that.loaded=1; }
    this.tileSize = 16;    // size of tiles on screen; set how you please
    this.imgTileSz = 32;    // sze of tiles in tabTiles01: 32
    this.tileW = this.cxw / this.tileSize; 
    this.tileH = this.cxh / this.tileSize; 

    // find the first and last note to draw
    this.duration = secPerTile * this.tileW;
    this.startTime = this.duration * whichLine;
    this.endTime = this.duration * whichLine;
    this.firstNote = -1; 
    this.lastNote = -1; 

    // use the line to determine how to gather notes into measures. 
    // then, the first note in the first measure is the actual first note. 
    
    var notInYet, notOutYet, isIn, last; 
    notInYet = 0; notOutYet=0;
    last = score.length(); 
    for (i=0; i<)
    	aNote = score.nth(i); 
    	if (notInYet==0) {
    		if (aNote.t >=this.startTime)

    	}
    }
    // I don't care about measure markings; others will. 
}


// given a MIDI tone and a place on the measures, draw. 
exScoreLine.prototype = {
    drawPluck: function(string, fret, tm, ppn) { 
        var t0,mi,bpms,px,py,tx,ty, i; 
        
        t0 = this.timer.lastMeasureTime;
        mi = this.timer.measureInterval; 
        bi = this.timer.beatInterval; 
        bpms = this.timer.beatsPerMeasure; 

        px = (((tm-t0)/mi)*bpms);
        if ((px>=-0.01)&&(px<=(7.99*bpms))) {
            for (i=7; i>2; i=i-1) { 
                if (px>=((bpms*i)-0.1)) {
                    px +=1.0; 
                }
            }
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



    exTabDisplay.prototype.redrawer = function(noteList) {
        var i, p, x, plusx, perc, bpm, nc, mstart, bt, intv, measCt; 

        this.clear(); 
        bpm = this.timer.beatsPerMeasure; 

        // two time sliders: one for measure
        perc = this.timer.measureFraction;
        x = this.tileSize * ((this.timer.beatsPerMeasure * perc)+1.0); 
        this.drawSliderSprite(x, 0, 2,9);
        // .. one for beat.
        perc = this.timer.beatFraction;
        x = this.tileSize * (perc+1.0); 
        this.drawSliderSprite(x, 0, 2,9);

        // draw three measures of tab
        for (measCt=0; measCt<8; measCt=measCt+1) { 
            this.drawLargeSprite((bpm+1)*measCt,1, 3,1, 1,6); //xy txy sxy  rt bar
            this.drawStretchedSprite(1+((bpm+1)*measCt),1, 1,1, 1,6, bpm,1); // vert bar on left
            this.drawLargeSprite(1+((bpm+1)*measCt),0, 0,8, bpm,1); // above rt
        
        }
        // draw the miniscore at the bottom. instead of one sprite/beat, 
        // vertical scale is 8 px/beat
        var pxPerNote = 8; 
        this.drawStretchedSprite(0,8, 4,9, 1,1, 40,1); // horiz lines
        nc = 30; 
        if (noteList.length<nc) { nc = noteList.length; }
        for (i=0; i<16; i=i+1) { // measure vert bars
            this.drawSliderSprite(i*pxPerNote*(bpm+1), 8, 3,9); 
        }
        

        // plucks!
        for (i=0; i<noteList.length(); i=i+1) {
            p = noteList.nth(i); 
            this.drawPluck(p.string, p.fret, p.t, 8.0);
        }
    }





    ////////////////// exTabLine is an exScoreLine that draws its notes as tab
    //    it needs a tuning!


    function exTabLine(aCanvas, startTime) {
    	this.ox = 0; // origin
    	this.oy = 0; 

    	this.myCanvas = aCanvas; 

    }


    // given a MIDI tone and a place on the measures, draw. 
    exTabLine.prototype.drawPluck = function(string, fret, tm, ppn) { 
        var t0,mi,bpms,px,py,tx,ty, i; 
        
        t0 = this.lastMeasureTime;
        mi = this.timer.measureInterval; 
        bi = this.timer.beatInterval; 
        bpms = this.timer.beatsPerMeasure; 

        px = (((tm-t0)/mi)*bpms);
        if ((px>=-0.01)&&(px<=(7.99*bpms))) {
            for (i=7; i>2; i=i-1) { 
                if (px>=((bpms*i)-0.1)) {
                    px +=1.0; 
                }
            }
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

        // also draw below
        // what measure is this note in? 
        px = tm-t0; 
        ms = Math.floor((px/mi)+0.1);
        if ((ms>=0) && (ms<16)) {
            px = px/bi; 
            px = ((px+ms)*ppn)+6;
            spx = 10-string;
            this.drawSliderSprite(px,8, spx,9);
        }
    }



    exTabDisplay.prototype.redrawer = function(noteList) {
        var i, p, x, plusx, perc, bpm, nc, mstart, bt, intv, measCt; 

        this.clear(); 
        bpm = this.timer.beatsPerMeasure; 

        // two time sliders: one for measure
        perc = this.timer.measureFraction;
        x = this.tileSize * ((this.timer.beatsPerMeasure * perc)+1.0); 
        this.drawSliderSprite(x, 0, 2,9);
        // .. one for beat.
        perc = this.timer.beatFraction;
        x = this.tileSize * (perc+1.0); 
        this.drawSliderSprite(x, 0, 2,9);

        // draw three measures of tab
        for (measCt=0; measCt<8; measCt=measCt+1) { 
            this.drawLargeSprite((bpm+1)*measCt,1, 3,1, 1,6); //xy txy sxy  rt bar
            this.drawStretchedSprite(1+((bpm+1)*measCt),1, 1,1, 1,6, bpm,1); // vert bar on left
            this.drawLargeSprite(1+((bpm+1)*measCt),0, 0,8, bpm,1); // above rt
        
            //this.drawLargeSprite(0,1, 3,1, 1,6); //xy txy sxy  left bar
            //this.drawLargeSprite(bpm+1,1, 3,1, 1,6); //xy txy sxy  rt bar
            //this.drawLargeSprite((bpm*2)+2,1, 3,1, 1,6); //xy txy sxy  rt bar

    //    this.drawStretchedSprite(1,1, 1,1, 1,6, bpm,1); // vert bar on left
      //  this.drawStretchedSprite(2+bpm,1, 1,1, 1,6, bpm,1); // on mid
        //this.drawStretchedSprite(3+(bpm*2),1, 1,1, 1,6, bpm,1); // on rt

    //    this.drawLargeSprite(1,0, 0,8, bpm,1); // beats ticks above left
      //  this.drawLargeSprite(2+bpm,0, 0,8, bpm,1); // above mid
        //this.drawLargeSprite(3+(bpm*2),0, 0,8, bpm,1); // above rt
        }
        // draw the miniscore at the bottom. instead of one sprite/beat, 
        // vertical scale is 8 px/beat
        var pxPerNote = 8; 
        this.drawStretchedSprite(0,8, 4,9, 1,1, 40,1); // horiz lines
        nc = 30; 
        if (noteList.length<nc) { nc = noteList.length; }
        for (i=0; i<16; i=i+1) { // measure vert bars
            this.drawSliderSprite(i*pxPerNote*(bpm+1), 8, 3,9); 
        }
        

        // plucks!
        for (i=0; i<noteList.length(); i=i+1) {
            p = noteList.nth(i); 
            this.drawPluck(p.string, p.fret, p.t, 8.0);
        }
    }








    function exScoreDisplay(aCanvas, doClef, doTab) {
        this.canvas = aCanvas; 
        this.context = aCanvas.getContext("2d");
        this.hasTab = doTab; 
        this.hasClef = doClef; 

        this.context.fillStyle = 'white';
        this.context.strokeStyle = "#000";
        this.cxw = this.context.canvas.width; 
        this.cxh = this.context.canvas.height; 

        this.timer = aTimer; 

        this.loaded = 0; 
        this.tiles = new Image(); 
        this.tiles.src = "tabTiles01.png"; 
        that = this;
        this.tiles.onload = function(that) { that.loaded=1; }
        this.tileSize = 16;    // size of tiles on screen; set how you please
        this.imgTileSz = 32;    // sze of tiles in tabTiles01: 32
        this.tileW = this.cxw / this.tileSize; 
        this.tileH = this.cxh / this.tileSize; 


    }

    // 
    exScoreDisplay.prototype.drawMinSprite = function(x, y, tx, ty) { 
    	if (x>this.tileW) { return; }
    	if (y>this.tileH) { return; }
        var ts = this.tileSize; 
        var is = this.imgTileSz
        this.context.drawImage(this.tiles, tx*is, ty*is, is, is, x*ts, y*ts, ts, ts); 
    }


    exScoreDisplay.prototype.drawLargeSprite = function(x, y, tx, ty, txsz, tysz) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz
        this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, x*ts, y*ts, txsz*ts, tysz*ts); 
    }

    exScoreDisplay.prototype.drawStretchedSprite = function(x, y, tx, ty, txsz, tysz, xscale, yscale) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz
        this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, x*ts, y*ts, txsz*ts*xscale, tysz*ts*yscale); 
    }

    exScoreDisplay.prototype.clear = function() {
        this.context.fillStyle = this.bg;
        this.context.beginPath();
        this.context.rect(0,0, 640, this.cxh);
        this.context.fill();
    }

    // given a MIDI tone and a place on the measures, draw. 
    exScoreDisplay.prototype.drawPluck = function(string, fret, tm, ppn) { 
        var t0,mi,bpms,px,py,tx,ty, i; 
        
        t0 = this.timer.lastMeasureTime;
        mi = this.timer.measureInterval; 
        bi = this.timer.beatInterval; 
        bpms = this.timer.beatsPerMeasure; 

        px = (((tm-t0)/mi)*bpms);
        if ((px>=-0.01)&&(px<=(7.99*bpms))) {
            for (i=7; i>2; i=i-1) { 
                if (px>=((bpms*i)-0.1)) {
                    px +=1.0; 
                }
            }
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

        // also draw below
        // what measure is this note in? 
        px = tm-t0; 
        ms = Math.floor((px/mi)+0.1);
        if ((ms>=0) && (ms<16)) {
            px = px/bi; 
            px = ((px+ms)*ppn)+6;
            spx = 10-string;
            this.drawSliderSprite(px,8, spx,9);
        }
    }



    exTabDisplay.prototype.redrawer = function(noteList) {
        var i, p, x, plusx, perc, bpm, nc, mstart, bt, intv, measCt; 

        this.clear(); 
        bpm = this.timer.beatsPerMeasure; 

        // two time sliders: one for measure
        perc = this.timer.measureFraction;
        x = this.tileSize * ((this.timer.beatsPerMeasure * perc)+1.0); 
        this.drawSliderSprite(x, 0, 2,9);
        // .. one for beat.
        perc = this.timer.beatFraction;
        x = this.tileSize * (perc+1.0); 
        this.drawSliderSprite(x, 0, 2,9);

        // draw three measures of tab
        for (measCt=0; measCt<8; measCt=measCt+1) { 
            this.drawLargeSprite((bpm+1)*measCt,1, 3,1, 1,6); //xy txy sxy  rt bar
            this.drawStretchedSprite(1+((bpm+1)*measCt),1, 1,1, 1,6, bpm,1); // vert bar on left
            this.drawLargeSprite(1+((bpm+1)*measCt),0, 0,8, bpm,1); // above rt
        
            //this.drawLargeSprite(0,1, 3,1, 1,6); //xy txy sxy  left bar
            //this.drawLargeSprite(bpm+1,1, 3,1, 1,6); //xy txy sxy  rt bar
            //this.drawLargeSprite((bpm*2)+2,1, 3,1, 1,6); //xy txy sxy  rt bar

    //    this.drawStretchedSprite(1,1, 1,1, 1,6, bpm,1); // vert bar on left
      //  this.drawStretchedSprite(2+bpm,1, 1,1, 1,6, bpm,1); // on mid
        //this.drawStretchedSprite(3+(bpm*2),1, 1,1, 1,6, bpm,1); // on rt

    //    this.drawLargeSprite(1,0, 0,8, bpm,1); // beats ticks above left
      //  this.drawLargeSprite(2+bpm,0, 0,8, bpm,1); // above mid
        //this.drawLargeSprite(3+(bpm*2),0, 0,8, bpm,1); // above rt
        }
        // draw the miniscore at the bottom. instead of one sprite/beat, 
        // vertical scale is 8 px/beat
        var pxPerNote = 8; 
        this.drawStretchedSprite(0,8, 4,9, 1,1, 40,1); // horiz lines
        nc = 30; 
        if (noteList.length<nc) { nc = noteList.length; }
        for (i=0; i<16; i=i+1) { // measure vert bars
            this.drawSliderSprite(i*pxPerNote*(bpm+1), 8, 3,9); 
        }
        

        // plucks!
        for (i=0; i<noteList.length(); i=i+1) {
            p = noteList.nth(i); 
            this.drawPluck(p.string, p.fret, p.t, 8.0);
        }
    }





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
        this.tiles.onload = function(that) { that.loaded=1; }
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
    exPageTabDisplay.prototype.drawPluck = function(string, fret, tm, ppn, bx, by) { 
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
    exPageTabDisplay.prototype.drawStaff = function(noteList, measureStart) { 
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





