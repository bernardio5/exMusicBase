

/*
   Implements tile map drawing on a rectilinear grid. 
    There is a default tile set. 
    The grid size in it is 32. The grid size on canvas is 16px.

    Takes an origin in grid coords; draws relative to that. 
    Tracks a bounding-box; erases only that, to white.
    
    for the drawing functions, (x,y) are grid/canvas coords, 
    and (tx,ty) specify the sprite to draw.
*/
// exSprite.js lets you make a sheet of music, tab or clef. 
// the standard canvas should be 1024x640. Sprites are 16x16.
// That gives 64x40 sprites. Tab lines are 7 sprites tall.

// before including this file, include exMusic.js

// Canvas aCanvas, float x0, float y0
function exSpriteCanvas(aCanvas, x0, y0) {
    this.canvas = aCanvas; 

    this.context = aCanvas.getContext("2d");
    this.context.fillStyle = 'white';
    this.context.strokeStyle = "#000";
    this.cxw = this.context.canvas.width; 
    this.cxh = this.context.canvas.height; 
    this.tileSize = 16;    // size of tiles on screen; set how you please
    this.imgTileSz = 32;    // sze of tiles in exTiles: 32
    this.tileW = Math.floor(this.cxw / this.tileSize) + 1; // # tiles available on canvas in X
    this.tileH = Math.floor(this.cxh / this.tileSize) + 1; // in Y
    this.x0 = x0 * this.tileSize;
    this.y0 = y0 * this.tileSize;

    // load the tile set bitmap. 
    this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = "../exTiles.png"; 
    that = this;
    this.tiles.onload= function(that) { that.loaded=1; }

    // bbox for all draws since last erase-- uses canvas 
    this.minX = 999.0; 
    this.minY = 999.0; 
    this.maxX = -999.0; 
    this.maxY = -999.0; 
}


exSpriteCanvas.prototype = {
    // draw tile at tx,ty at grid point x, y-- minimal default case
    drawSprite: function(x, y, tx, ty) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz;
        var xpos = this.x0 + (ts*x); 
        var ypos = this.y0 + (ts*y); 
        this.context.drawImage(this.tiles, tx*is, ty*is, is, is, xpos, ypos, ts, ts); 
        if (x<this.minX) { this.minX = x; }
        if (y<this.minY) { this.minY = y; }
        if (x>this.maxX) { this.maxX = x; }
        if (y>this.maxY) { this.maxY = y; }
        
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
    },


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
    drawSliderSprite: function(xsl, y, tx, ty) { 
        var ts = this.tileSize; 
        var is = this.imgTileSz
        var xpos = this.x0 + xsl/ts; 
        var ypos = this.y0 + (ts*y); 
        this.context.drawImage(this.tiles, tx*is, ty*is, is, is, xpos, ypos, ts, ts); 
        if ((xsl/ts)<this.minX) { this.minX = xsl/ts; }
        if (y<this.minY) { this.minY = y; }
        if ((xsl/ts)>this.maxX) { this.maxX = xsl/ts; }
        if (y>this.maxY) { this.maxY = y; }
    },


    // sigh. what is this whole class even for? 
    drawCheaterSprite: function(x, y, tx, ty) { 
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
        this.minX = 999.0; 
        this.minY = 999.0; 
        this.maxX = -999.0; 
        this.maxY = -999.0; 
    },

    // erases canvas
    clearAll: function() {
        var ts = this.tileSize; 
        this.context.fillStyle = this.bg;
        this.context.beginPath();
        this.context.rect(0.0,0.0, this.tileW*ts, this.tileH*ts);
        this.context.fill();
    },
}





////////////////// exSpriteTabRow draws one line? row? of a notelist, in tab
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// multiple usage modes
// static, pretty display, multiple rows, tab only
// spd,mr, tab and clef alternating
// dynamic display, occasional updates, single line, accompanying timeline
// dynamic, continuous crawl, generally single line
// all of these supported by clef, too.


// given am HTML canvas, a notelist, ?, tiles
//   assumes that the noteList notes already have fret and string set
function exSpriteTabRow(aCanvas, aNoteList, x0, y0, tilesPerSec, aTunedHand, showClef) {
    this.theCanvas = new exSpriteCanvas(aCanvas, x0, y0); 
    this.notes = aNoteList; 
    this.tilesPerSec = tilesPerSec;
    this.hand = aTunedHand;
    
    if (showClef) {
        this.offset = 6;
    } else {
        this.offset = 3; 
    }
    this.duration = (this.theCanvas.tileW - this.offset) / tilesPerSec;
    this.startTime = 0.0; 
    this.endTime = this.duration; 
}


exSpriteTabRow.prototype = {
    setStartTime: function(t) { 
        this.startTime = t; 
        this.endTime = t + this.duration; 
    },


    // assumes that the note has fret and string set 
    drawPluck: function(aNote, ppn) { 
        var px,py,tx,ty; 
        px = (((aNote.t-this.startTime)*this.tilesPerSec))+this.offset; 
        py = 6-aNote.string; 
        tx = aNote.fret; 
        ty = 0; 
        this.theCanvas.drawSprite(px,py, tx,ty); 
    },


    redrawer: function() {
        var i, f, p; 

        this.theCanvas.clear(); 

        // letters at line beginning--?
        //    drawStretchedSprite: function(x, y, tx, ty, txsz, tysz, xscale, yscale) 
        strs = this.hand.strings;
        for (i=0; i<strs.length; i=i+1) {
            f = (strs[i])+1;
            this.theCanvas.drawSprite(0,i+1, 4+(f%12),12);
            this.theCanvas.drawStretchedSprite(1,i+1,  1,8,  1,1,  this.theCanvas.tileW,1);  // lines
        }
        // plucks!
        for (i=0; i<this.notes.length(); i=i+1) {
            p = this.notes.nth(i); 
            if ((this.startTime<=p.t)&&(p.t<this.endTime)) {
                this.drawPluck(p, 8.0);
            }
        }
    },
};



///////////////////////////////// exClefDisplayLine
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
// draws one line of a score in, in (treble) clef notation, from a sprite sheet. 
// additional variables say whether to include the clef, start time, pace, and ...?
// disclaimer: known flaws, noted in code. To do this "properly" is a large project. 

function exSpriteClefRow(aCanvas, aNoteList, x0, y0, tilesPerSec, aKey, showClef)  {
    this.theCanvas = new exSpriteCanvas(aCanvas, x0, y0); 
    this.notes = aNoteList; 
    this.tilesPerSec = tilesPerSec;
    this.key = aKey;
    this.showClef = showClef;
    if (showClef) {
        this.offset = 5;
    } else {
        this.offset = 1; 
    }
    this.duration = (this.theCanvas.tileW - this.offset) / tilesPerSec;
    this.startTime = 0.0; 
    this.endTime = this.duration; 

    // Each C is is at height (5.5 - (octave-4)*3.5). The other notes are above their C's.
    // There are 12 notes from C to the next C.
    this.heights = [ 0.0, 0.0, 1.0,  1.0, 2.0, 3.0,  3.0, 4.0, 4.0,  5.0, 5.0, 6.0 ];
    this.decor =   [0, 1, 0,           1, 0, 0,         1, 0, 1,       0, 1, 0 ];
    this.sig = [0,0,0, 0,0,0, 0,0,0, 0,0,0];  // what notes are sharp or flat in key signature

    this.timeNumerator = -1; 
    this.timeDenominator = 4;
    this.showTiming = false; 
}



exSpriteClefRow.prototype = {
    // used by the page-formatter object to set this row's span of the work
    setStartTime: function(t) {
        this.startTime = t;
        this.endTime = this.duration +t;
    },


    ////////////////////////// setKey helpers
    isIn: function(arr, it) { // returns ar1, minus anything that's in ar2
        var i, len1; 
        len1 = arr.length; 
        for (i=0; i<len1; i=i+1) {
            if (it===arr[i]) {
                return true;
            }
        }
        return false; 
    },

    commonElements: function(ar1, ar2) { // given 2 arrays, return array of elements in both
        var i, len1, res; 
        res = [];
        len1 = ar1.length; 
        for (i=0; i<len1; i=i+1) {
            if (this.isIn(ar2, ar1[i])) { 
                res.push(ar1[i]);
            }
        }
        return res; 
    },

    subtract: function(ar1, ar2) { // returns ar1, minus anything that's in ar2
        var i, len1, res; 
        res = [];
        len1 = ar1.length; 
        for (i=0; i<len1; i=i+1) {
            if (!this.isIn(ar2, ar1[i])) { 
                res.push(ar1[i]);
            }
        }
        return res; 
    },

    shifter: function(ar1, shifter) { // returns ar1, with shifter added to everything
        var i, len1, ith, res; 
        res = [];
        len1 = ar1.length; 
        for (i=0; i<len1; i=i+1) {
            ith = ar1[i] + shifter; 
            res.push(ith);
        }
        return res; 
    },

    // for n, the ith element of source, set target[n]=val
    caster:function(target, source, val) {
        var i, len, n, val, ind; 
        len = source.length;
        for (i=0; i<len; i=i+1) {
            n = source[i]; 
            target[n]=val;
        }
    },

     // want heights like for cm=[0,0,1,1,2,3,3,4,4,5,5,6], or e=[0,0,1,1,2,3,4,4,5,5,6];
    //  height of spot on clef from C
    // want decor like for   cm=[0,1,0,1,0,0,1,0,1,0,1,0] or  e=[3,0,3,0,0,3,0,3,0,1,0];
    //   0:none 1:sharp, 2:flat 3:natural

    // observations: 
    // 1) clef notation represents note placement onto piano keys: white and black.
    //     The white keys are the notes of C-Major. Clef for other keys represents notes
    //   in-key, that are on black keys, as though they were on white, with the key signature
    //   showing that they are moved. 
    // 2)  Notes not in the key are represented as a deviation from the closest in-key note.
    //   There are usually two! 
    // 3) Algorithm: 
    //   a) represent the key to be displayed as a list of the notes in the 0-octave of the key. 
    //         This is an array of 7 integers. Let C0=0 and C1=12; F#=7, call this "scaleIn"
    //   b) goals: i: heights, an array of 12 integers, showing each note's steps up from the height of C
    //            ii: decor: an array of 12 ints showing whether that note is unmarked, sharp, flat, or natural.
    //           iii: sig: an array of 12 ints showing which notes are sharpened or flattened
    //   c: steps
    //      i: get the scaleIn of C-Major, call that CMwhites.
    //      ii: let "whites"=the notes in both CMwhites and scaleIn. 
    //          These are the notes in scaleIn that go on white keys
    //      iii: let "blacks"= notes in scaleIn not in whites-- the black keys
    //      iv: Let "unsharps"= notes in blacks moved down one note
    //      v: Let "unflats"= notes in blacks moved up one.
    //      vi: Let "naturals"= whichever of unsharps and unflats that has no element in common with whites.
    //  If either is 0, this shows you how to move the black keys to the white ones. 
    //  If neither is 0, the key is G#, and you have to move C to B. Other, less common keys 
    //     can bring you here; not all keys can be mapped. I'll eventually have a workaround.
    //  If both are 0, the Key is C, and the rest of the steps will be silly. 
    //      vii: If naturals==unsharps, set the flag "direction"=sharp, otherwise flat
    //      vii: initialize heights to be all -1, decor to all no-mark, sig to all 0.
    //      viii: for the ith note, n, of CMwhites, set heights[i]=n
    //      ix: for the ith note, n, of naturals, set sig[n]=direction
    //      x: for the ith note, n, of naturals, set decor[n]=natural
    //      xi: for the ith note, n, of blacks, if direction=sharp, set heights[i]=heights[i+1], else i-1
    //      xii: for the nth note, of heights, that is still -1, 
    //          if direction==sharp, set heights[n] = heights[n-1] and decor[n]=sharp
    //          if direction==flat,  set heights[n] = heights[n+1] and decor[n]=flat


    // given a key, compute the heights and decor for each note in the scale
    setKey: function(aKey) { 
        var scaleIn, CMwhites, whites, blacks, unsharps, unflats;
        var sharpOverlap, flatOverlap, direction, naturals, i, len, n; 
        scaleIn = aKey.scale;                       // 3.a
        CMwhites = [0,2,4,5,7,9,11];                // 3.c.i
        whites =    this.commonElements(scaleIn, CMwhites); // 3.c.ii
        blacks =    this.subtract(scaleIn, whites);// 3.c.iii
        unsharps =  this.shifter(blacks, -1);       // 3.c.iv
        unflats =   this.shifter(blacks, 1);        // 3.c.v

        sharpOverlap = this.commonElements(whites, unsharps); // 3.c.vi
        flatOverlap =  this.commonElements(whites, unflats);
        if (sharpOverlap.length ===0) {
            direction = 1; // 1=sharp, 2=flat, 3=natural
            naturals = unsharps;
        } else { // what about G#M?!?! Shaddup. Nobody can play it anyway.
            direction = 2; 
            naturals = unflats; 
        }

        this.decor = [0,0,0, 0,0,0, 0,0,0, 0,0,0];  // 3.c.vii 
        this.sig = [0,0,0, 0,0,0, 0,0,0, 0,0,0];
        this.heights = [0,-1,1,  -1,2,3,  -1,4,-1,  5,-1,6]; // 3.c.viii

        this.caster(this.sig, naturals, direction); // 3.c.ix
        this.caster(this.decor, naturals, 3);       // 3.c.x

        len = blacks.length;
        for (i=0; i<len; i=i+1) {                   // 3.c.xi    
            n = blacks[i]; 
            if (direction===1) {
                this.heights[n] = this.heights[n-1]; 
            } else {
                this.heights[n] = this.heights[n+1];
            }
        }

        for (i=0; i<12; i=i+1) {                    // 3.c.xii
            if (this.heights[i]===-1) { 
                if (direction===1) {
                    this.heights[i] = this.heights[i-1]; 
                } else {
                    this.heights[i] = this.heights[i+1];
                }
                this.decor[i] = direction; 
            }
        }

    },


     // draw the note on the page
    // we could save this and recalc only when the note changes-- meh. 
    drawNote: function(theNote) { 
        var placeInScale, octave, isSharp, base, noteHeight, gx, i; 
    // debugger;
        if ((theNote.midi<33)||(theNote.midi>84)) { return; }  // clef note range; constants

        placeInScale = (theNote.midi %12); 
        octave = Math.floor(((theNote.midi-placeInScale))/12.0);
        base = 3.5*(octave-4);
        noteHeight = 4.5-(base + (this.heights[placeInScale]*.5));
    
        gx = ((theNote.t-this.startTime) * this.tilesPerSec)+this.offset; 
        this.theCanvas.drawStretchedSprite(gx,noteHeight, 9,6, 1,1, 1.75,1.75); 
        
        switch (this.decor[placeInScale]) { 
            case 1: this.theCanvas.drawStretchedSprite(gx-.5,noteHeight-.2, 7,6, 1,1, 1.4,1.4); break;
            case 2: this.theCanvas.drawStretchedSprite(gx-.5,noteHeight-.2, 11,0, 1,1, 1.4,1.4); break;
            case 3: this.theCanvas.drawStretchedSprite(gx-.5,noteHeight-.2, 10,13, 1,1, 1.4,1.4); break;
        }
        
        // note above staff? draw intevening lines
        for (i=0; i<5; i=i+1) {
            if (noteHeight < (-1-i)) {
                this.theCanvas.drawStretchedSprite(gx, -1.05-i, 1,8, 1,1, 1.75,1.2);
            }
        }
        // note below
        //debugger;
        for (i=0; i<5; i=i+1) {
            if (noteHeight > (4+i)) {
                this.theCanvas.drawStretchedSprite(gx,4.95+i,  1,8, 1,1,  1.75,1.2);
            }
        }    
    },

    clearAll: function() { 
        this.theCanvas.clearAll();
    },


    redrawer: function() {
        var i, p; 
        // this.theCanvas.clear(); 

        for (i=0; i<5; i=i+1) {
            this.theCanvas.drawStretchedSprite(0,i,  1,8,  1,1,  this.theCanvas.tileW,1);  // lines
        } 
        if (this.showClef) {
            this.theCanvas.drawStretchedSprite(0,-1.0,  0, 1,  2, 5, 1.5,1.5); // clef
            // key markings? 

            if (this.timeNumerator>-1) { 
                this.theCanvas.drawStretchedSprite(4,0.2,  this.timeNumerator,0, 1,1, 2.5,2.5); // numerator
                this.theCanvas.drawStretchedSprite(4,2.2,  this.timeDenominator,0, 1,1, 2.5,2.5); // denominator
            }

            
        }
        // plucks!
        for (i=0; i<this.notes.length(); i=i+1) {
            p = this.notes.nth(i); 
            if ((this.startTime<=p.t)&&(p.t<=this.endTime)) { 
                //p.midi = 30+i; // test code 
                this.drawNote(p);
            }
        }
    }
};


//////////////////////////////////// exSpriteTimeLine
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
// draws a line with a mark on it that slides. handy!

function exSpriteTimeLine(aCanvas, aNoteList, x0, y0, tilesPerSec, aSignature, showClef) {
    this.theCanvas = new exSpriteCanvas(aCanvas, x0, y0); 
    this.notes = aNoteList; 
    this.tilesPerSec = tilesPerSec;
    this.signature = aSignature;
    this.showClef = showClef;
    if (showClef) {
        this.offset = 5;
    } else {
        this.offset = 1; 
    }
    this.duration = (this.theCanvas.tileW - this.offset) / tilesPerSec;
    this.startTime = 0.0; 
    this.endTime = this.duration; 

    this.timeNumerator = 4; 
    this.timeDenominator = 4;
};



exSpriteTimeLine.prototype = {
   setStartTime: function(t) {
        this.startTime = t;
        this.endTime = this.duration +t;
        this.t = this.startTime; 
    },

    redrawer: function() {
        var x, fract; 

        this.signature.update(); 
        // timeline
        this.theCanvas.drawStretchedSprite(0,0,  1,8,  1,1,  this.theCanvas.tileW,1);  
        // beat marks?
        // measure marks?

        // two time sliders: one for measure
        fract = this.signature.measureFraction;
        x = this.offset + (this.tilesPerSec * (fract/this.signature.beatInterval)); 
        this.theCanvas.drawSliderSprite(x,0, 6,6);

        // .. one for beat.
        fract = this.signature.beatFraction;
        x = this.offset + (this.tilesPerSec * (fract / this.signature.measureInterval)); 
        this.theCanvas.drawSliderSprite(x,0, 6,6);
    }
};





//////////////////////////////////// exSpriteTabSet
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
// draw multiple exSpriteTabRows, given top-left and vertical spacing

//function exSpriteTabSet(aCanvas, aNoteList, ) {
    // in a for loop or something
    // this.theCanvas = new exSpriteTabLine(aCanvas, ); 
//};


//exSpriteTabSet.prototype = {



//};



///////////////////////////////////////// exSpriteClefSet
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////


//function exSpriteClefSet(aCanvas, aTimer, aTuning) {
//};


///////////////////////////////////////// exSound
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// this is sloppy. many questions. 
// also not where this goes. goes in exMusic? 
function exWebAudio(aNoteList) { 
    this.notes = aNoteList; 
    this.t = 0; 
    this.hasAudio = true; 
    this.freqs = [
32.703, 34.648, 36.708, 38.891, 41.203,  43.654, 46.249, 48.999, 51.913, 55.0,   58.270, 61.735, // you know?
65.406, 69.296, 73.416, 77.782, 82.407,  87.307, 92.499, 97.999, 103.83, 110.00, 116.54, 123.47, // can't hear these. 
130.81, 138.59, 146.83, 155.56, 164.81,  174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94, 
261.63, 277.18, 293.67, 311.13, 329.63,  349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 
523.25, 554.37, 587.33, 622.25, 659.26,  698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77,
1046.5, 1108.7, 1174.7, 1244.5, 1318.5,  1396.9, 1480.0, 1568.0, 1661.2, 1760.0, 1864.7, 1975.5, 
2093.0, 2217.5, 2349.3, 2489.0, 2637.0,  2793.0, 2960.0, 3136.0, 3322.4, 3520.0, 3729.3, 3951.1
    ]; 

    try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        this.context = new AudioContext();
    } catch(e) {
        alert('Web Audio API is not supported in this browser');
        this.hasAudio =false; 
    }
        
    if (this.hasAudio) {
        this.audioCon = new webkitAudioContext();
        this.oscillator = audioCon.createOscillator();
        this.gainNode = audioCon.createGain(); 
        this.oscillator.type = 0
        this.oscillator.frequency.value = 220.0// freqs[note-24];
        this.gainNode.gain.value = 0.0; 
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioCon.destination);
        this.oscillator.start(); 
        this.gainNode.gain.value = 0.0; 
    }
}
// multiple oscillators? 
// this.audioCon vs window.audioContext? 


exWebAudio.prototype = {
    play: function(note) {
        if (this.hasAudio===1) {
            if ((note>23)&&(note<105)) {
                this.oscillator.frequency.value = this.freqs[note-24];
                this.gainNode.gain.value = 1.0; 
            } else {
                this.gainNode.gain.value = 0.0;
            }
        }
    },

    pause: function() {
        oscillator.disconnect();
    },  /// is this restartable? 

    setTime: function(t) { 
        this.t = t; 
    },

    update:function(dt) { 
        // find notes st this.t<note.t<this.t+dt
        // start those
        // find ending notes and stop them. 
        this.t += dt; 
    }

}


/*



/////////////////  exTabDisplay: tab notation for guitars  
/////////////////  exTabDisplay: tab notation for guitars  
// the tab display has a two-measure area, a current and a next measure. 
// there is a slider at the top, and it shows where you are in playback.

// aHand, aNoteList..? 
function exTabDisplay(aCanvas, aTimer) {
    this.canvas = aCanvas; 
    this.context = aCanvas.getContext("2d");
        
    this.context.fillStyle = 'white';
    this.context.strokeStyle = "#000";
    
    this.timer = aTimer; 

    this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = "tabTiles01.png"; 
    that = this;
    this.tiles.onload = function(that) { that.loaded=1; }
    this.tileSize = 32;     

    this.timer = aTimer; 

}

// the scales, building off of fundamental tones
// 



exTabDisplay.prototype.copy = function (n) {  
    // as above, so here. later
}

// 
exTabDisplay.prototype.drawMinSprite = function(x, y, tx, ty) { 
    var ts = this.tileSize; 
    this.context.drawImage(this.tiles, tx*ts, ty*ts, ts, ts, x*ts, y*ts, ts, ts); 
}

exTabDisplay.prototype.drawSliderSprite = function(x, y, tx, ty) { 
    var ts = this.tileSize; 
    this.context.drawImage(this.tiles, tx*ts, ty*ts, ts, ts, x, y*ts, ts, ts); 
}

exTabDisplay.prototype.drawLargeSprite = function(x, y, tx, ty, txsz, tysz) { 
    var ts = this.tileSize; 
    this.context.drawImage(this.tiles, tx*ts, ty*ts, txsz*ts, tysz*ts, x*ts, y*ts, txsz*ts, tysz*ts); 
}

exTabDisplay.prototype.drawStretchedSprite = function(x, y, tx, ty, txsz, tysz, xscale, yscale) { 
    var ts = this.tileSize; 
    this.context.drawImage(this.tiles, tx*ts, ty*ts, txsz*ts, tysz*ts, x*ts, y*ts, txsz*ts*xscale, tysz*ts*yscale); 
}


    the whole point of this is... not this. 
exTabDisplay.prototype.drawMidi = function(midi, step) { 
    var site = this.aTunedHand.getFretForNote(midi); 
    this.drawPluck(site[0], site[1], step); 
}

    


exTabDisplay.prototype.clear = function() {
    this.objCount = 1;
    this.iteratorCounter = 0;
    
    this.cxw = this.context.canvas.width; 
    this.cxh = this.context.canvas.height; 
    
    this.context.fillStyle = this.bg;
    this.context.beginPath();
    this.context.rect(0,0, this.cxw, this.cxh);
    this.context.fill();
        
}

// given a MIDI tone and a place on the measures, draw. 
exTabDisplay.prototype.drawPluck = function(string, fret, tm, ppn) { 
    var t0,mi,bpms,px,py,tx,ty; 
    
    t0 = this.timer.lastMeasureTime;
    mi = this.timer.measureInterval; 
    bi = this.timer.beatInterval; 
    bpms = this.timer.beatsPerMeasure; 

    px = (((tm-t0)/mi)*bpms);
    if ((px>=-0.01)&&(px<=(2.99*bpms))) {
        if (px>=((bpms*2)-0.1)) {
            px +=3.0; 
        }
        if (px>=(bpms-0.1)) {
            px += 4.2; 
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
    if ((ms>=0) && (ms<20)) {
        px = px/bi; 
        px = ((px+ms)*ppn)+6;
        spx = 10-string;
        this.drawSliderSprite(px,8, spx,9);
    }
}



exTabDisplay.prototype.redrawer = function(noteList) {
    var i, p, x, plusx, perc, bpm, nc, mstart, bt, intv; 

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

    // draw two measures of tab
    this.drawLargeSprite(0,1, 3,1, 1,6); //xy txy sxy  left bar
    this.drawLargeSprite(bpm+3,1, 3,1, 1,6); //xy txy sxy  rt bar
    this.drawLargeSprite((bpm*2)+6,1, 3,1, 1,6); //xy txy sxy  rt bar
    this.drawStretchedSprite(1,1, 1,1, 1,6, bpm+1,1); // vert bar on left
    this.drawStretchedSprite(4+bpm,1, 1,1, 1,6, bpm+1,1); // on rt
    this.drawStretchedSprite(7+(bpm*2),1, 1,1, 1,6, bpm+1,1); // on rt
    this.drawLargeSprite(1,0, 0,8, bpm+1,1); // beats ticks above left
    this.drawLargeSprite(4+bpm,0, 0,8, bpm+1,1); // above rt
    this.drawLargeSprite(7+(bpm*2),0, 0,8, bpm+1,1); // above rt

    // draw the miniscore at the bottom. instead of one sprite/beat, 
    // vertical scale is 8 px/beat
    var pxPerNote = 8; 
    this.drawStretchedSprite(0,8, 4,9, 1,1, 26,1); // horiz lines
    nc = 30; 
    if (noteList.length<nc) { nc = noteList.length; }
    for (i=0; i<30; i=i+1) { // measure vert bars
        this.drawSliderSprite(i*pxPerNote*(bpm+1), 8, 3,9); 
    }
    

    // plucks!
    for (i=0; i<noteList.length; i=i+1) {
        p = noteList[i]; 
        this.drawPluck(p[2], p[3], p[1], 8.0); 
    }
}

        



*/

///////////////////////////////////////// exControls
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
// A set of contoller object generators
//    Each generates HTML code for pickers, filled with music-related options.
//    Each also provides a value-fetching function.
//    Does place constraints on what ID's you use in your HTML
//    Option values correspond to constants in exKey, exTunedHand, and exChord


function exControls(document) {
    this.myDocument = document;
};


exControls.prototype = {
    // two drop-downs that allow users to select a MIDI notes 12-96,
    //   many of which I can't hear on my laptop's speakers. 
    getHTMLForTonic: function() { 
        var res = "<select id='exTonic'>";
        res = res + "<option value='0' selected>C</option>";
        res = res + "<option value='1'>C#</option>";
        res = res + "<option value='2'>D</option>";
        res = res + "<option value='3'>D#</option>";
        res = res + "<option value='4'>E</option>";
        res = res + "<option value='5'>F</option>";
        res = res + "<option value='6'>F#</option>";
        res = res + "<option value='7'>G</option>";
        res = res + "<option value='8'>G#</option>";
        res = res + "<option value='9'>A</option>";
        res = res + "<option value='10'>A#</option>";
        res = res + "<option value='11'>B</option>";
        res = res + "</select>/";
        res = res + "<select id='exOctave'>";
        res = res + "<option value='12'>0</option>";
        res = res + "<option value='24'>1</option>";
        res = res + "<option value='36'>2</option>";
        res = res + "<option value='48'>3</option>";
        res = res + "<option value='60' selected>4</option>";
        res = res + "<option value='72'>5</option>";
        res = res + "<option value='84'>5</option>";
        res = res + "</select>";
        return res; 
    },
    getValueForTonic: function() {
        var res = 0; 
        var fun = parseInt(document.getElementById('exTonic').value);
        var oct = parseInt(document.getElementById('exOctave').value);
        res = fun+oct;
        return res; 
    },


    // for those thinking of measures.. doofs. 
    getHTMLForBeatsPerMeasure: function() { 
        var res = "<select id='exBeatsPerMeasure'>";
        res = res + "<option value='0' selected>1</option>";
        res = res + "<option value='1'>2</option>";
        res = res + "<option value='2'>3</option>";
        res = res + "<option value='3'>4</option>";
        res = res + "<option value='4'>5</option>";
        res = res + "<option value='5'>6</option>";
        res = res + "<option value='6'>7</option>";
        res = res + "<option value='7'>8</option>";
        res = res + "<option value='8'>9</option>";
        res = res + "<option value='9'>10</option>";
        res = res + "<option value='10'>11</option>";
        res = res + "<option value='11'>12</option>";
        res = res + "</select>";
        return res; 
    },
    getValueForBeatsPerMeasure: function(document) {
        var res = parseInt(document.getElementById('exBeatsPerMeasure').value); 
        return res; 
    },

/*      [ 0, 2,4, 5,7,9,11 ], // major
        [ 0, 2,3, 5,7,8,10 ], // minor
        [ 0, 2,3, 5,7,9,10 ], // dorian
        [ 0, 2,4, 5,6,10   ], // wholetone
        [ 0, 2,3, 6,7,8,10 ], // "hungarian"
        [ 0, 4,6, 7,11     ], // "chinese"
        [ 0, 1,3, 5,7,9,10 ]  // "javan"
        [ 0,1,2,3,4,5,6,7,8,9,10,11 ]  // 12 */

    getHTMLForMode: function() { 
        var res = "<select id='exMode'>";
        res = res + "<option value='0' selected>Major</option>";
        res = res + "<option value='1'>Minor</option>";
        res = res + "<option value='2'>Dorian</option>";
        res = res + "<option value='3'>Whole</option>";
        res = res + "<option value='4'>Hungarian</option>";
        res = res + "<option value='5'>Pentatonic</option>";
        res = res + "<option value='6'>Heptatonic</option>";
        res = res + "<option value='7'>12</option>"; // seriously? kinda moots key.
        res = res + "</select>";
        return res; 
    },
    getValueForMode: function() {
        var res = parseInt(this.document.getElementById('exMode').value); 
        return res; 
    },

    /*  if (which==0) { this.strings = [40,45,50,55,59,64]; } // standard guitar e2 a2 d3 g3 b3 e4
        if (which==1) { this.strings = [38,45,50,54,57,62]; } // open D    d2 a2 d3 f#3 a3 d4
        if (which==2) { this.strings = [48,52,55,60,64,67]; } // open C    c3 e3 g3 c4 e4 g4
        if (which==3) { this.strings = [40,45,50,54,59,64]; } // don't remember! low!
        // the one for el noy, the one for passemezze
        if (which==10) { this.strings = [67,60,64,69]; } // uke!    g4 c4 e4 a4
        if (which==11) { this.strings = [55,62,69,76]; } // violin   g3,d4,a4,e5
        if (which==12) { this.strings = [55,62,69,76]; } // mandolin   as violin
        if (which==13) { this.strings = [67,50,55,59,62]; } // banjo   g4,d3,g3,b3,d4
        if (which==14) { this.strings = [36,43,50,57]; } // cello   c2,g2,d3,a3
        // Bazooki? Udtz? Samisan? Sitar?! 
        For use with exTunedHand
    */
    getHTMLForTuning: function() { 
        var res = "<select id='exTuning'>";
        res = res + "<option value='0' selected>Standard Guitar</option>";
        res = res + "<option value='1' selected>Guitar Drop D</option>";
        res = res + "<option value='2' selected>Open C</option>";
        res = res + "<option value='3' selected>EADF#BE</option>";
        res = res + "<option value='10' selected>Ukulele</option>";
        res = res + "<option value='11' selected>Violin/Mandolin</option>";
        res = res + "<option value='13' selected>Banjo</option>";
        res = res + "<option value='14' selected>Cello</option>";
        res = res + "</select>";
        return res; 
    },
    getValueForTuning: function() {
        var res = parseInt(this.document.getElementById('exTuning').value); 
        return res; 
    },



//        Beats per Minute:<input type="text" value='100' size=5 id ='tempo' /><br />
//        anin.bpMinute = parseInt(document.getElementById('tempo').value);

};





///////////////////////////////////////// exTextTab
///////////////////////////////////////// exTextTab
///////////////////////////////////////// exTextTab
///////////////////////////////////////// exTextTab
///////////////////////////////////////// exTextTab
// given a notelist, and a tuned hand, and maybe a signature, 
// make a grid of characters that can be printed or viewed

// the string "this.grid" is 96 characters wide x 60 lines 


function exTextTab(titleStr, tunedHand, columnsPerSecond) { 
    this.grid = ""; 
    this.titleString = titleStr;
    this.hand = tunedHand; 
    this.strCount = this.hand.strCount; 
    this.rowHeight = this.strCount +2;  // "row"=line of tab 
    this.rowsPerPage = Math.floor(60.0 / this.rowHeight);
    this.blankPage(); 

    this.columnsPerNote = 3; // characters it takes to show a note
    this.columnsPerSecond = columnsPerSecond;
    this.rowsPerSecond = columnsPerSecond / 85.0;  // 90 columns/line
    this.pageDuration = this.rowsPerPage / this.rowsPerSecond;

    return this; 
}


exTextTab.prototype = { 
    // str and fill are strings. add fills to str until its length is len.
    fillout: function(str, fill, len) { 
        var i, inLen, fillLen, res; 
        inLen = str.length; 
        fillLen = fill.length; 
        res = str; 
        for (i=inLen; i<(len-fillLen); i=i+fillLen) { 
            res = res + fill; 
        } 
        return res;
    },


    // put string cha in column x, row y of this.grid
    plot: function(x, y, cha) {
        var len = cha.length;
        // must not write out of bounds..
        if ((x<-1)||(x>(88-len))||(y<0)||(y>60)) { return; } 
        // especially, don't overwrite the CR at EOL
        var ind = 6 + x + (y*95); 
        res = this.grid.substr(0, ind) + cha + this.grid.substr(ind+len);
        this.grid = res; 
        // console.log("plot: ("+ x + ',' + y + ')->' + ind);
    },


    // given an exNote, assuming this page starts at t=0
    plotNote: function(that, note) {
        var x, y, str, whichRow, rowt, rowRow; 
//debugger;
        if ((note.string!=-1)&&(note.t>=0.0)&&(note.t<that.pageDuration)) {
            // which row to put the note on
            whichRow = Math.floor(note.t * that.rowsPerSecond);
            rowRow = (that.strCount - note.string); 
            // start time of that row
            rowt = whichRow / that.rowsPerSecond; 
            //console.log('plotNote: string:' + note.string + ' fret:' + note.fret + ' row:' +whichRow);
            x = 3 + Math.floor((note.t-rowt)*that.columnsPerSecond); 
            y = 1 + (that.rowHeight * whichRow) + rowRow;
            str = '' + note.fret;
            that.plot(x,y,str); 
        }
    },


    // sets "this.grid" to contain empty lines
    blankPage: function() { 
        var i, j, k, scr;
        var aLine, aRow, aBlankLine, rowCt;
        var aNote = new exNote(); 

        // make sure title line is 96 chars!
        scr = "     " + this.titleString;
        scr = this.fillout(scr, ' ', 95);
        scr = scr + '\n';

        aLine = this.fillout('-', '-', 93); 
        aLine += '\n';
        aBlankLine = this.fillout(' ', ' ', 95); 
        aBlankLine += '\n';

        aRow = aBlankLine;
        for (i=0; i<this.strCount; i=i+1) {
            aNote.midi = this.hand.strings[i];
            aRow = aRow + aNote.letter() + aLine; 
        }
        aRow += aBlankLine; 
        
        // make a blank grid of lines
        for (i=0; i<this.rowsPerPage; i=i+1) {
            scr = scr + aRow;
        }
        this.grid = scr; 
        this.rowCt = rowCt; 
    },


    plotNoteList: function(nl) { 
        this.blankPage(); 
        // does not work; plotNote loses track of this
        nl.apply(this, this.plotNote);
    }

}







