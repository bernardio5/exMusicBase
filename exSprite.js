

/*
    Replaces loosey-goosey canvas drawing with 
    a tile map drawn on a rectilinear grid. 
    For the ex library, there is a default tile set. 
    The grid size in it is 32. The grid size is 16px.

    Default is to draw only with integer grid coordinates. 

    Takes an origin in grid coords; draws relative to that. 

    Tracks a bounding-box; erases only that, to white.
    
    for the drawing functions, (x,y) are grid/canvas coords, 
    and (tx,ty) specify the sprite to draw.




// exSprite.js lets you make a sheet of music, tab or clef. 

// the standard canvas should be 1024x640. Sprites are 16x16. 
// that gives 64x40 sprites. Tab lines are 7 sprites tall.



*/
// before including this file, include exMusic.js

// Canvas aCanvas, float x0, float y0
function exSpriteCanvas(aCanvas, tileSetName, x0, y0) {
    this.canvas = aCanvas; 
    this.context = aCanvas.getContext("2d");
    this.context.fillStyle = 'white';
    this.context.strokeStyle = "#000";
    this.cxw = this.context.canvas.width; 
    this.cxh = this.context.canvas.height; 
    this.tileSize = 16;    // size of tiles on screen; set how you please
    this.imgTileSz = 32;    // sze of tiles in tabTiles01: 32
    this.tileW = (this.cxw / this.tileSize) + 1; // # tiles available on canvas in X
    this.tileH = (this.cxh / this.tileSize) + 1; // in Y
    this.x0 = x0 * this.tileSize;
    this.y0 = y0 * this.tileSize;

    // load the tile set bitmap. 
    this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = tileSetName; 
    that = this;
    this.tiles.onload: function(that) { that.loaded=1; }

    // bbox for all draws since last erase-- uses canvas 
    this.minX = x0; 
    this.minY = y0; 
    this.maxX = x0+20; 
    this.maxY = y0+20; 
}


exSpriteCanvas.prototype = {
    // draw tile at tx,ty at grid point x, y-- minimal default case
    drawSprite: function(x, y, tx, ty) { 
        if ((x>-1)&&(x<this.tileW)&&(y>-1)&&(y<this.tileH)) {
            var ts = this.tileSize; 
            var is = this.imgTileSz;
            var xpos = this.x0 + (ts*x); 
            var ypos = this.y0 + (ts*y); 
            this.context.drawImage(this.tiles, tx*is, ty*is, is, is, xpos, ypos, ts, ts); 
            if (x<this.minX) { this.minX = x; }
            if (y<this.minY) { this.minY = y; }
            if (x>this.maxX) { this.maxX = x; }
            if (y>this.maxY) { this.maxY = y; }
        }
    },


    // draws multiple tiles on a grid point
    drawLargeSprite: function(x, y, tx, ty, txsz, tysz) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz;
        var xpos = this.x0 + (ts*x); 
        var ypos = this.y0 + (ts*y); 
        this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, xpos, ypos, txsz*ts, tysz*ts); 
        if (x<this.minX) { this.minX = x; }
        if (y<this.minY) { this.minY = y; }
        if ((x+txsz)>this.maxX) { this.maxX = (x+txsz); }
        if ((y+tysz)>this.maxY) { this.maxY = (y+tysz); }
    }


    // scale the sprite by xscale and yscale 
    drawStretchedSprite: function(x, y, tx, ty, txsz, tysz, xscale, yscale) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz
        var xpos = this.x0 + (ts*x); 
        var ypos = this.y0 + (ts*y); 
        this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, xpos, ypos, txsz*ts*xscale, tysz*ts*yscale); 
        if (x<this.minX) { this.minX = x; }
        if (y<this.minY) { this.minY = y; }
        if (((x+txsz)*xscale)>this.maxX) { this.maxX = ((x+txsz)*xscale); }
        if (((y+tysz)*yscale)>this.maxY) { this.maxY = ((y+tysz)*yscale); }
    },


    // frees sprite from grid in x-- useful for timer sliders. 
    drawSliderSprite = function(xsl, y, tx, ty) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz
        var xpos = xsl/ts; 
        var ypos = this.y0 + (ts*y); 
        this.context.drawImage(this.tiles, tx*is, ty*is, is, is, xsl+this.x0, ypos, ts, ts); 
        if (xpos<this.minX) { this.minX = xpos; }
        if (y<this.minY) { this.minY = y; }
        if (((xpos+txsz)*xscale)>this.maxX) { this.maxX = ((xpos+txsz)*xscale); }
        if (((y+tysz)*yscale)>this.maxY) { this.maxY = ((y+tysz)*yscale); }
    },


    // sigh. what is this whole class even for? 
    drawCheaterSprite = function(x, y, tx, ty) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz
        var xpos = x/ts; 
        var ypos = y/ts; 
        this.context.drawImage(this.tiles, tx*is, ty*is, is, is, x+this.x0, y+this.y0, ts, ts); 
        if (xpos<this.minX) { this.minX = xpos; }
        if (ypos<this.minY) { this.minY = ypos; }
        if (((xpos+txsz)*xscale)>this.maxX) { this.maxX = ((xpos+txsz)*xscale); }
        if (((ypos+tysz)*yscale)>this.maxY) { this.maxY = ((ypos+tysz)*yscale); }
    },


    // erases canvas
    clear: function() {
        var ts = this.tileSize; 
        this.context.fillStyle = this.bg;
        this.context.beginPath();
        this.context.rect(this.x0 + (this.minX*ts), this.y0+(this.minY*ts), this.maxX*ts, this.maxY*ts);
        this.context.fill();
        this.minX = 0; 
        this.minY = 0; 
        this.maxX = 1; 
        this.maxY = 1; 
        this.
    },
}



////////////////// exSpriteTabRow draws one line? row? of a notelist, in tap
////////////////// exSpriteTabRow draws one line? row? of a notelist, in tap
////////////////// exSpriteTabRow draws one line? row? of a notelist, in tap
////////////////// exSpriteTabRow draws one line? row? of a notelist, in tap
////////////////// exSpriteTabRow draws one line? row? of a notelist, in tap

// given am HTML canvas, a notelist, ?, tiles
//   assumes that the noteList notes already have fret and string set
function exSpriteTabRow(aCanvas, score, line, secPerTile, whichLine) {
    this.ox = 0; // origin
    this.oy = 0; 

    this.theCanvas = exSpriteCanvas(aCanvas, "exTilesTab01.png", x0, y0)); 
    this.score = exNoteList; 

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
exSpriteTabRow.prototype = {
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
            this.theCanvas.drawMinSprite(px,py, tx,ty); 
        }

    },



    redrawer: function(noteList) {
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


    redrawer: function(noteList) {
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
};



///////////////////////////////// exClefDisplayLine
/////////////////////////////////
///////////////////////////////// exClefDisplayLine
/////////////////////////////////
///////////////////////////////// exClefDisplayLine
/////////////////////////////////
///////////////////////////////// exClefDisplayLine
/////////////////////////////////
// draws one line of a score in, in (treble) clef notation, from a sprite sheet. 
// additional variables say whether to include the clef, start time, pace, and ...?

// Canvas aCanvas, int x0, int y0, int wd, exKey *aKey, float tiles/sec
function exSpriteClefRow(aCanvas, x0, y0, wd, aKey, tilesPerSecond) {
    // more or less constants
    this.spc = new exSpriteCanvas(aCanvas, "exTilesClef01.png", x0, y0);  // x0y0 in tile-grid coords
    this.wd = wd; // width of line in tiles
    this.aKey = key; // this.aKey is a pointer; allows dynamic changes. 
    this.tileRate = tilesPerSecond;  // sets density of notes on line

    // member variables
    this.dt = wd/tilesPerSecond; // t0+
}


exLineClef.prototype = {
    // the spots are notes
    drawSpot: function(x, y) { 
        theContext.drawImage(tiles, 9*TILESZ, 6*TILESZ, TILESZ, TILESZ, x, y, TILESZ, TILESZ); 
    },

    // lines above and below the clef lines around individual notes
    drawLine: function(x, y) { 
        theContext.drawImage(tiles, 12*TILESZ, 6*TILESZ, TILESZ, TILESZ, x, y, TILESZ, TILESZ); 
    },

    // sharps in front of notes
    drawSharp: function(x, y) { 
        theContext.drawImage(tiles, 7*TILESZ, 6*TILESZ, TILESZ, TILESZ, x, y, TILESZ, TILESZ); 
    },

// draw the note on the page
// we could save this and recalc only when the note changes-- meh. 
    drawNote: function(theNote, step) { 
        var gx, placeInScale, octave, isSharp, base, noteHeight; 
    
        if ((theNote<24)||(theNote>104)) { return; }  // clef note range; constants
        placeInScale = (theNote %12); 
        octave = Math.floor(((theNote-placeInScale))/12.0);
        isSharp = sharps[placeInScale]; 
    
        base = 216.0 - (octave-4)*70.0;
        noteHeight = base - heights[placeInScale];
    
        gx = 128+ (step*30.0); 
        drawSpot(gx, noteHeight); 
        
        if (isSharp==1) { 
            drawSharp(gx-12.0, noteHeight-8.0);
        }
        
        
        if (theNote>68) { 
            drawLine(gx, 96.0);
        }
        if (theNote>71) { 
            drawLine(gx, 76.0);
        }
        if (theNote>75) { 
            drawLine(gx, 56.0);
        }
        if (theNote>78) { 
            drawLine(gx, 36.0);
        }
        if (theNote>81) { 
            drawLine(gx, 16.0);
        }
    
        
        if (theNote<50) {
            drawLine(gx, 216.0);
        }
        if (theNote<47) {
            drawLine(gx, 236.0);
        }
        if (theNote<44) {
            drawLine(gx, 256.0);
        }
        if (theNote<41) {
            drawLine(gx, 276.0);
        }
        if (theNote<36) {
            drawLine(gx, 296.0);
        }
        if (theNote<32) {
            drawLine(gx, 316.0);
        }

    },

    function onRow(y) { 
        return  Math.floor(y/TILESZ); 
    },

    function onCol(x) { 
        return Math.floor(x/TILESZ); 
    },


    redrawer: function(noteList) {
        var nt0, t0, t1, i; 

        nt0 = noteList.getFirstNote();
        t0 = nt0.t;
        t1 = t0 + this.dt;


        this.spc.clear(); 

        this.spc.drawLargeSprite((bpm+1)*measCt,1, 3,1, 1,6); //xy txy sxy  rt bar
        this.spc.drawStretchedSprite(1+((bpm+1)*measCt),1, 1,1, 1,6, bpm,1); // vert bar on left
        this.spc.drawLargeSprite(1+((bpm+1)*measCt),0, 0,8, bpm,1); // above rt
        

        // plucks!
        for (i=0; i<noteList.length(); i=i+1) {
            p = noteList.nth(i); 
            this.drawPluck(p.string, p.fret, p.t, 8.0);
        }
    },
}


//////////////////////////////////// exSpriteTimeLine
//////////////////////////////////// exSpriteTimeLine
//////////////////////////////////// exSpriteTimeLine
//////////////////////////////////// exSpriteTimeLine
// draws a line with a mark on it that slides. handy!








//////////////////////////////////// exSpriteTabSet
//////////////////////////////////// exSpriteTabSet
//////////////////////////////////// exSpriteTabSet
//////////////////////////////////// exSpriteTabSet
// draw multiple exSpriteTabRows, given top-left and vertical spacing

function exSpriteTabSet(aCanvas, aNoteList, ) {
    // in a for loop or something
    // this.theCanvas = new exSpriteTabLine(aCanvas, ); 
};


exSpriteTabSet.prototype = {


    // given a MIDI tone and a place on the measures, draw. 
    drawStaff: function(noteList, measureStart) { 
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
};



///////////////////////////////////////// exSpriteClefSet
///////////////////////////////////////// exSpriteClefSet
///////////////////////////////////////// exSpriteClefSet
///////////////////////////////////////// exSpriteClefSet


function exSpriteClefSet(aCanvas, aTimer, aTuning) {
};




