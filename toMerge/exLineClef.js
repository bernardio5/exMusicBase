
var exNote = require('./exNote');
var exNoteList = require('./exNoteList');
var exSpriteCanvas = require('./exSpriteCanvas');

// Canvas aCanvas, int x0, int y0, int wd, exKey *aKey, float tiles/sec
function exLineClef(aCanvas, x0, y0, wd, aKey, tilesPerSecond) {
    // more or less constants
    this.spc = new exSpriteCanvas(aCanvas, x0, y0);  // x0y0 in tile-grid coords
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

module.export = exLineClef;




