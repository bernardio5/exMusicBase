





/* you have rhythm and a chord. shuffle takes them and ... ?

    There are three shuffle types: 
        Note: one note, same note, per line 
        Chord: same chord 
            oo: some notes in or out? 
        

    Operations on shuffles tend to just be regeneration
        Note: pick a different note: change the chord!
        Chord: different chord: change that

        Arpeggiation: 

            Changes to inputs keep that randomness, 
            are recognizably the same. 

    Duration is set by the line. 
    Emphasis is set by having many lines. 


    I don't like the interface yet. 
    goals: 
        set from one line of code. 
        init random
        modify incrementally
        have incremental mods not disrupt

    life cycle: init, according to various patterns

*/


function exShuffle(aChord, aLine, aType) { 
    this.chord = new exChord(); 
    this.chord.copy(aChord); 
    
    this.line = aLine; 
    this.distType = aType; 
    this.events = []; 
    this.type = 0; 
}


exShuffle.prototype.copy = function(it) { 
}

exShuffle.prototype.setLine = function(aLine) { 
    this.line = aLine; 
    this.rerender(); 
}

exShuffle.prototype.setChord = function(aCh) { 
    this.chord = aCh; 
    this.rerender(); 
}

// yeah, this will make really boring music. 
// if this is all that you are doing!
exShuffle.prototype.rerender = function(controlA, controlB, deck) {
    switch (this.type) {
        case 0: this.setToSteadies(controlA, controlB, deck); break; 
        case 1: this.setToChord(controlA, controlB, deck); break; 
        case 2: this.setToSweeps(controlA, controlB, deck); break; 
        case 3: this.setToTrill(controlA, controlB, deck); break; 
        case 4: this.setToNoodle(controlA, controlB, deck); break; 
    }
}

// one note? a chord? every hit? one? 
// chord selected how? 
exShuffle.prototype.setToSteady = function() { 

}

// 
exShuffle.prototype.setToSweep = function() { 

}


// can't apply
exShuffle.prototype.apply = function(t0, t1) {
    this.events = [];
    this.line.setEventsForSpan(t0,t1); 

    var i,j;
    baseNote = this.chord.getNthNote(0);
    for (i=0; i<this.line.eventCount; i=i+1) {
        // set line's events for span
        baseLineEv = this.line.getNthEvent(i);
        t = baseLineEv[0]; 

        switch (this.type) { 
            case 0: // single note
            // push [t,baseNote]
//                this.events.push()
                break;
            case 1: // chord
            // for each n in chord
            // push [t, n]
                break;
            case 2: // arpeg
            // n = this.chord.getNthNote(randos[i])
            // push [t, n];
                break; 
        }

    }
}

// what a mess! 
















/*
/////////////////////////////////////
// exMotif takes a chord, lines, shufflings, and a deck, and returns
function exMotif(aChord) { 

    // what we're working with
    this.sourceChord = aChord; // MIDI tone values

    this.prefTime = [ 0, 4, 2, 6,  3, 5, 7, 1 ];  
    this.aprgTime = [ 0, 7, 2, 4,  1, 5, 4, 6 ];  

    // what we're making here
    this.notes = new Array(); // indices into sourceChord
    this.starts = new Array(); //indices into mdMotifPrefTime
    this.durations = new Array(); // 0-7; multiply by .125 to get duration

    // the motif has its own timing coordsys. this moves it within the comp
    this.trans = 0.0; 
    this.scale = 1.0; 
    
    // rendering targets containing only data derived from above
    this.MIDI = new Array(); // the notes in the motif
    this.startTime = new Array(); // when they start/end
    this.startTime = new Array();

}




// there should be more starts on start and half than 3/8ths of the way in

exMotif.prototype.render = function() {
    var i, j, st, stIndx, md; 

    this.MIDI =new Array(); 
    this.startTime = new Array(); 
    this.endTime = new Array(); 

    j=0; 
    for (i=0; i<this.notes.length; ++i) { 
        md = this.sourceChord.nthChordNote(i);
        this.MIDI[j] = md;
        if ((35<md)&&(md<87)) { 
            st = this.prefTime[this.starts[j]] * 0.125;
            st = this.trans + (this.scale*st); 
            st = st - floor(st); 
            this.startTime[j] = st;
            st = this.startTime[j] + this.durations[j] * 0.125 * this.scale;
            if (st>1.0) { st = 1.0; }
            this.endTime[j] = st;
            ++j; 
        }
    }
}


exMotif.prototype.copy = function(it) {
    this.sourceChord.copy(it.sourceChord);
    this.notes = it.notes.concat();     
    this.starts = it.starts.concat();     
    this.duration = it.duration.concat();     
    trans = it.trans; 
    scale = it.scale; 
    this.render();
}


/// return an int from 0-range
exMotif.prototype.niRand = function(range) {
    return Math.floor(Math.random()*range); 
}


// bias/100 of time, return 0, 
// (100-bias)bias/100, return 1, etc. 
// if bias==100, always return 0
// if bias<10, basically a random number in the bounds
exMotif.prototype.getPreferredIndex = function(bias, bound) {
    var i, res; 
    
    i=0; res = -1; 
    while (res==-1) { 
        if (this.niRand(100)>bias) { 
            res = i;
        } else {
            ++i; 
            if (i>bound) { i=0; }
        }
    }
    return res;
}


exMotif.prototype.setChord = function(chds) {
    this.sourceChord.copy(chds); 
    this.render(); 
 }

exMotif.prototype.makeFromChord = function(chord, complexity) {

    var i, j, chomper, startBias, noteBias, noteCount; 
 
    this.setChord(chord); 
 
    chomper = Math.floor(c*4)+1; // simple->1  complex->5
    noteCount = this.niRand(chomper) + 2; // at least 2; maybe 7
    
    startBias = 60 - Math.floor(c*30);
    noteBias = 80 - Math.floor(c*20);
    i=0; j=0; 
    while ((j<noteCount)&&(i<this.chord.chord.length)) {  
        if (this.niRand(100)>noteBias) { // strongly tend to get the first few chord notes
            this.notes[j] = i; 
            this.starts[j] = this.getPreferredIndex(startBias, 7);
            this.durations[j] = this.niRand(4);
            ++j;
        }
        ++i;
    }
    // noteCount = j;
    this.trans = 0.0; 
    this.scale = 1.0; 
    
    this.render(); 
}


exMotif.prototype.setFundamental = function() {

// - (void)setFundamental {
    this.notes[0] = 0; 
}


exMotif.prototype.findClosestInChord = function(md) {
// - (int)findClosestInChord:(int)md {
    var i, del, minDel, best; 
    
    best = -1; 
    minDel = 99999; 
    for (i=0; i<chordSz; ++i) { 
        del = abs(this.sourceChord[i] - md); 
        if (del<minDel) { 
            best = i; 
            minDel = del; 
        }
    }
    return best; 
}


exMotif.prototype.command = function(which, n) {
//- (void)command:(int)which withArgument:(float)n {
    var i, intn, swapper, a, b;
    
    var commands = ["scale", "trans", "multSc", "addTrans", "shift", "rev", 
        "invert", "shuffle", "randNote", "arp"]; 

    for (i=0; i<commands.length; i=i+1) {


    }

    intn = (int)(floor(n));
    switch (which) { 
        case MTC_SCALE: scale=n; break;
        case MTC_TRANSLATE: trans=n; break;
        case MTC_MULTIPLY_SCALE: scale*=n; break;
        case MTC_ADD_TRANSLATE: trans=((trans+n)-(floor(trans+n))); break;
        case MTC_SHIFT:
            // n == the number of semitones up/down; prefer mults of 3, 4 and 12!
            for (i=0; i<noteCount; ++i) {
                this.notes[i] = this.findClosestInChord(this.sourceChord[this.notes[i]])*n; 
            }
            break;
        case MTC_REVERSE:
            for (i=0; i<noteCount/2; ++i) { 
                swapper = this.notes[i]; 
                this.notes[i] = this.notes[(noteCount-1)-i];
                notes[(noteCount-1)-i] = swapper; 
            }
            break;
        case MTC_INVERT: 
            break;
        case MTC_SHUFFLE:
            for (i=0; i<10; ++i) {
                a = [self niRand:noteCount]; 
                b = [self niRand:noteCount]; 
                
                swapper = notes[a]; 
                notes[a] = notes[b];
                notes[b] = swapper; 
            }
            break;
        case MTC_RAND_NOTE: 
            i = [self niRand:noteCount];
            notes[i] = [self niRand:4]; 
            starts[i] = [self getPreferredIndex:66 max:7];
            break;
        case MTC_ADD_NOTE: 
            if (noteCount< MD_MOTIF_LEN) { 
                i= noteCount;
                notes[i] = [self niRand:4]; 
                starts[i] = [self getPreferredIndex:66 max:7];
                durations[i] = [self niRand:4];
                ++noteCount;
            }
            break;
        case MTC_ARPEGGIATE: 
            for (i=0; i<noteCount; ++i) {
                starts[i] = mdAprgTime[i];
                durations[i] = .125;
            }
            scale = .25;
            trans = [self niRand:4]*0.25;
            break;
    }
    [self render];
    
}


//////////  iteration for rendering
exMotif.prototype.noteCount = function() {
//- (int)noteCount { 
    return renderedNoteCount; 
}

// can return MIDI==-1!!
exMotif.prototype.getNthNote = function(n, target) {
//- (int)getNthNote:(int)n andPutItHere:(noteType*)storage {
    var res= 0; 

    if ((n>-1)&&(n<this.renderedNoteCount())) { 
        target.MIDI = this.MIDI[n];
        target.start = this.startTime[n];
        target.stop = this.endTime[n];
        res = 1; 
    }
    return res; 
}


*/
























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

/*
    the whole point of this is... not this. 
exTabDisplay.prototype.drawMidi = function(midi, step) { 
    var site = this.aTunedHand.getFretForNote(midi); 
    this.drawPluck(site[0], site[1], step); 
}
*/
    


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

        






