
// musical exercises classes 
// javascript about music


/*
Considerations: 

How to compose with short inputs and randomness. 

Music is sound structured like language. 
Music uses many patterns. The patterns reduce the number of choices. 
But not so much that there are not too many choices. Like language!

Music has structure that is not exposed except over time. 
The structures I am aware of seem pretty trivial: interpolation, alternation, 
arithmetic progression. So I can get good results soon? Hah. 

Music Theory Choices: 

Key, mode, and rhythm are the first reductions. Key changes for melodies
are a way to transform a set of frequency relationships and preserve 
their important relationships. Ok, got that.

Key/mode are represented by chord: an arbitrary set of notes in a scale. 

Lines are repeating rhythmic fragments; no tone assignments, just timing. 
One line is never enough. 

Key, chord, line, and __ combine to generate a set of notes. 
A single motif will not be interesting enough to be a composition, 
but interesting music seems available through manipulating this structure. 

The tuned hand encapsulates stringed instrument physicality. 
When you playa a guitar, it makes some notes easier to get to than others. 
That seems like a nice way to reduce the number of arbitrary decisions. 





*/

/////////////////  timer holds the time and beat. 
/////////////////  measures are present for the sake of updating the notation

function exTimer(bpMin, bpMeas, msPerUpdate, measCt) { 
	this.t = 0.0;
    this.dt = msPerUpdate / 1000.0;  // same as JS setInterval

    this.beatsPerMinute = bpMin; 
    this.beatInterval = 60.0/bpMin; // sec/min * min/bt = sec/bt 
    this.lastBeatTime = 0.0; 
    this.didCrossBeat = true; 
    this.beatCounter = 0; // Math.floor(this.t / this.beatInterval); 
    this.lastBeatTime = 0.0; // this.beatCounter * this.beatInterval; 
    this.beatFraction = 0.0; // (this.t- this.lastBeatTime)/this.beatInterval; 

    this.beatsPerMeasure = bpMeas; 
    this.measureInterval = this.beatInterval * bpMeas; 
    this.lastMeasureTime = 0.0; 
    this.didCrossMeasure = true; 
    this.measureCounter = 0; // Math.floor(this.t / this.measureInterval); 
    this.lastMeasureTime = 0.0; 
    this.measureFraction = 0.0;     

    this.measureCount = measCt; 
    this.workDuration = this.measureInterval * measCt;  
    this.repeats = true; 
    // t is time since beginning of work. 
    this.workFraction = this.t/this.workDuration; 
}


exTimer.prototype.copy = function (it) {  
    this.t                  = it.t;
    this.dt                 = it.dt;

    this.beatsPerMinute     = it.beatsPerMinute;
    this.beatInterval       = it.beatInterval;
    this.lastBeatTime       = it.lastBeatTime;
    this.didCrossBeat       = it.didCrossBeat;
    this.beatCounter        = it.beatCounter;
    this.lastBeatTime       = it.lastBeatTime;
    this.beatFraction       = it.beatFraction;

    this.beatsPerMeasure     = it.beatsPerMeasure;
    this.measureInterval     = it.measureInterval;
    this.lastMeasureTime     = it.lastMeasureTime;
    this.didCrossMeasure     = it.didCrossMeasure;
    this.measureCounter      = it.measureCounter;
    this.lastMeasureTime     = it.lastMeasureTime;
    this.measureFraction     = it.measureFraction;

    this.measureCount = it.measureCount; 
    this.workDuration = it.workDuration; 
    this.repeats = it.repeat; 
    this.workFraction = it.workFraction; 
}


exTimer.prototype.restart = function() { 
    this.t = 0.0;
    this.measureCount = 0; 
    this.lastMeasureTime = 0.0; 
    this.lastBeatTime = 0.0; 
    this.recalculate(); 
}

// returns void; use didCross to get stuff
exTimer.prototype.recalculate = function() {
    this.beatFraction = (this.t- this.lastBeatTime)/this.beatInterval; 
    if (this.beatFraction>1.0) { 
        this.didCrossBeat = true; 
        this.beatCounter = Math.floor(this.t / this.beatInterval); 
        this.lastBeatTime = this.beatCounter * this.beatInterval; 
        this.beatFraction = (this.t- this.lastBeatTime)/this.beatInterval; 
    } else { 
        this.didCrossBeat = false;
    }

    this.measureFraction = (this.t- this.lastMeasureTime)/this.measureInterval; 
    if (this.measureFraction>1.0) { 
        this.didCrossMeasure = true; 
        this.measureCounter = Math.floor(this.t / this.measureInterval); 
        this.lastMeasureTime = this.measureCounter * this.measureInterval; 
        this.measureFraction = (this.t- this.lastMeasureTime)/this.measureInterval; 
    } else { 
        this.didCrossMeasure = false;
    }

    this.workFraction = this.workDuration/this.t; 
    if (this.repeats==true) { 
        if (this.t> this.workDuration) { 
            this.t = 0.0;
            this.workFraction = 0.0; 
            // should call recalculate at this point
            // risks oo recursion if workDuration is somehow 0
            // get the rest next call
            // which should be in ~.05 sec. 
        }
    }
}


exTimer.prototype.advance = function() { 
    this.t += this.dt; 
    this.recalculate(); 
}

// the point of lines is, not everything happens on THE beat. 
exTimer.prototype.timeOfNthBeat = function(n) { 
    return this.beatInterval * Math.floor(n); 
}

exTimer.prototype.beatForTime = function(t) { 
    return Math.floor(t/this.beatInterval);
}

exTimer.prototype.timeOfNthMeasure = function(n) { 
    return this.measureInterval * Math.floor(n); 
}

exTimer.prototype.measureForTime = function(t) { 
    return Math.floor(t/this.measureInterval);
}

exTimer.prototype.measureOfNthBeat = function(n) { 
    return Math.floor(n/this.beatsPerMeasure); 
}

exTimer.prototype.beatOfNthMeasure = function(n) { 
    return Math.floor(b/this.beatsPerMeasure); 
}




// the exDeck class is where I get all of the stochastic bits. 
// use .seed to set yourself up for a specific sequence of shuffled numbers. 
// use .next to step through them; it returns a number, 0-255-- each one in 
// the same order, every time. 

// I used .generate to make the standard value for this.ns
// But only the one time. That way, you can get the same random composition
// many times. 

// yes, I'm sure many JS implementations use identical pseudorandom generators.
// are you asking me to assume they will never change? 

function exDeck() { 
    this.ns = [ 
        208, 65, 128, 207, 250, 184, 151, 77, 149, 166, 102, 191, 190, 93, 140, 223, 
        75, 108, 47, 183, 23, 100, 242, 227, 202, 158, 228, 241, 96, 220, 84, 42,  
        119, 177, 217, 22, 28, 20, 71, 46, 186, 124, 161, 131, 105, 234, 159, 144,  
        215, 150, 182, 8, 221, 138, 35, 244, 91, 83, 53, 134, 153, 238, 218, 87,  

        97, 56, 125, 82, 135, 0, 62, 130, 103, 90, 200, 50, 94, 127, 204, 117, 
        121, 245, 229, 19, 37, 116, 21, 222, 43, 213, 162, 187, 209, 5, 33, 60,  
        111, 76, 201, 74, 34, 211, 254, 106, 219, 64, 45, 88, 185, 126, 206, 86,  
        73, 80, 10, 104, 52, 6, 66, 205, 4, 3, 233, 48, 114, 89, 255, 194,  

        247, 152, 14, 170, 212, 41, 122, 78, 169, 188, 17, 148, 171, 31, 40, 30,  
        155, 12, 235, 39, 92, 165, 59, 25, 199, 68, 18, 214, 57, 115, 160, 156, 
        85, 141, 118, 173, 107, 11, 139, 243, 133, 2, 24, 38, 175, 231, 253, 195, 
        98, 137, 251, 61, 7, 72, 180, 95, 167, 163, 63, 132, 147, 226, 193, 154, 

        26, 55, 1, 113, 181, 99, 51, 101, 240, 120, 198, 176, 172, 81, 189, 32, 
        178, 203, 236, 44, 70, 145, 36, 179, 210, 9, 174, 112, 168, 110, 79, 136, 
        246, 224, 129, 232, 13, 252, 216, 157, 230, 196, 49, 123, 69, 58, 109, 54,  
        237, 67, 16, 248,  27, 192, 29, 197,  239, 164, 249, 142,  143, 225, 146, 15];
    this.sz = 256; 
    this.factor = 1.0/256.0;
    this.place = 0; 
}

exDeck.prototype.copy = function(it) { 
    this.place = it.place; // everything else should be a class constant. better idiom?  
}

exDeck.prototype.seed = function(which) { 
    this.place = which % this.sz; 
}

exDeck.prototype.nextI = function() { 
    var res = this.ns[this.place];
    this.place = this.place +1; 
    if (this.place>=this.sz) { 
        this.place = 0; 
    }
    return res; 
}

exDeck.prototype.nextF = function() {
    var res = this.factor;
    res *= this.nextI(); 
    return res; 
}

/* Maybe 256 won't be enough.. keep this around. 
exDeck.prototype.generate = function(size) { 
    var i, j, k, swap; 
    var res = []; 
    for (i=0; i<size; i=i+1) { res[i] = i; }
    for (i=0; i<10; i=i+1) {
        for (j=0; j<size; j=j+1) { 
            k = Math.floor(Math.random()*size);
            swap = res[j]; 
            res[j] = res[k]; 
            res[k] = swap;  
        } // console.log(i, j, k, swap); 
    }
    var st;
    for (i=0; i<size; i=i+16) { 
        st = "";
        for (j=0; j<16; j=j+1) {
            k = i+ j;  
            st = st + res[k] + ', ';
        }
        // outputs a new this.ns; copy and paste
        console.log(st); 
    }
}
*/









///////////////////// ultimately, arrays of notes
///////////////////// This is more of a data structure than a class.
///////////////////// Very public, members modified from outside, often, 
/////////////////////       used a lot as input for routines. I guess. 
function exNote() { 
    this.t = 0.0; 
    this.midi = 60; 
    this.weight = 4.0; 
    this.fret = 0;
    this.string = -1; 
    this.difficulty = 0;
    this.tonicSteps = 0; 
}

exNote.prototype.copy = function(it) { 
    this.t = it.t; 
    this.midi = it.midi; 
    this.weight = it.weight; 
    this.fret = it.fret; 
    this.string = it.string; 
    this.difficulty = it.difficulty; 
    this.tonicSteps = it.tonicSteps; 
}




function exNoteList() {
    this.ns = []; // notes
}

exNoteList.prototype.copy = function(it) { 
    var i; 
    for (i=0; i<it.ns.length; i=i+1) {
        this.ns[i] = new exNote(); 
        this.ns[i].copy(it.ns[i]);
    }
}

exNoteList.prototype.add = function(nt) { 
    var i = this.ns.length;
    this.ns[i] = new exNote(); // you can pass the same note over and over and still get a list
    this.ns[i].copy(nt);   
}

exNoteList.prototype.length = function() { return this.ns.length; }
exNoteList.prototype.nth = function(which) {  return this.ns[(which % this.ns.length)]; }











/////////////////  exTunedHand: a hand on a tuned guitar.  
/////////////////  exTunedHand: a hand on a tuned guitar.  

// this object encapsulates the fact that a guitar 
// is played by putting fingers on a fretboard, 
// and the fingers are on a hand that goes somewhere. 
// so there are notes that you can reach easily, 
// and many that you have to move your hand to get to, 
// and you don't want to move your hand if you don't have to. 

// the tunedHand is given a key or a chord, and it returns 
// a list of notes with annotations on how important they are
// and how easy they are to get to, and where you should put your hand. 

// each motif has a hand. 

function exTunedHand() {
    this.hand = 0; 
    this.across = 0;        // finger across all strings-- or only some? to do. 0=>none
    this.acrossBase = -1;   // if !=-1, the across finger is on all strings greater than this. 

    this.setToTuning(0); 

    // the notes one can reach with this tuning and this hand. 
    this.available = new exNoteList(); 
}
   

exTunedHand.prototype.copy = function(it) { 
    this.hand = it.hand; 
    this.across = it.across;
    this.acrossBase = it.acrossBase;
    this.setToTuning(it.tuning); 
}


exTunedHand.prototype.setToTuning = function(which) { 
    this.tuning =which; 
    if (which==0) { this.strings = [40,45,50,55,59,64]; } // standard guitar e2 a2 d3 g3 b3 e4
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
    this.strCount = this.strings.length; 
}


exTunedHand.prototype.setHandPlace = function(place) { 
    this.hand = place; 
    this.across = 0; 
}

exTunedHand.prototype.setBarre = function(place, lowest) { 
    this.hand = place; 
    this.across = place; 
    this.acrossBase = lowest; // the lowest string your finger's across. 
}

exTunedHand.prototype.setAvailable = function(keyOrChord) { 
    var i, strCt, baseNote, baseFret, inBarre, note, noteCtr; 
    strCt = this.strCount; 
    noteCtr = 0; 
    for (i=0; i<strCt; i=i+1) { // for each string
        baseNote = this.strings[i];
        baseFret = 0; 
        if (this.across!=0) {
            if (i>=this.acrossBase) { 
                baseFret = this.across; 
                baseNote += this.across; 
            }
        }
        for (j=0; j<5; j=j+1) { // for frets 0-4
            note = baseNote+j;
            wt = keyOrChord.getWeight(midi);
            if (wt>-999) {
                this.available[noteCtr] = note; 
                this.frt[noteCtr] = baseFret +j; 
                this.str[noteCtr] = i;
                this.weight[noteCtr] = wt; 
                this.dif[noteCtr] = j;
                noteCtr = noteCtr +1; 
            }
        }
    }
}























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
    this.cxw = this.context.canvas.width; 
    this.cxh = this.context.canvas.height; 
    
    this.timer = aTimer; 

    this.loaded = 0; 
    this.tiles = new Image(); 
    this.tiles.src = "../exTiles.png"; 
    that = this;
    this.tiles.onload = function(that) { that.loaded=1; }
    this.tileSize = 16;    // size of tiles on screen; set how you please
    this.imgTileSz = 32;    // sze of tiles in tabTiles01: 32
    this.tileW = this.cxw / this.tileSize; 
    this.tileH = this.cxh / this.tileSize; 
}

// 
exTabDisplay.prototype.drawMinSprite = function(x, y, tx, ty) { 
    var ts = this.tileSize; 
    var is = this.imgTileSz
    this.context.drawImage(this.tiles, tx*is, ty*is, is, is, x*ts, y*ts, ts, ts); 
}

exTabDisplay.prototype.drawSliderSprite = function(x, y, tx, ty) { 
    var ts = this.tileSize; 
    var is = this.imgTileSz
    this.context.drawImage(this.tiles, tx*is, ty*is, is, is, x, y*ts, ts, ts); 
}

exTabDisplay.prototype.drawLargeSprite = function(x, y, tx, ty, txsz, tysz) { 
    var ts = this.tileSize; 
    var is = this.imgTileSz
    this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, x*ts, y*ts, txsz*ts, tysz*ts); 
}

exTabDisplay.prototype.drawStretchedSprite = function(x, y, tx, ty, txsz, tysz, xscale, yscale) { 
    var ts = this.tileSize; 
    var is = this.imgTileSz
    this.context.drawImage(this.tiles, tx*is, ty*is, txsz*is, tysz*is, x*ts, y*ts, txsz*ts*xscale, tysz*ts*yscale); 
}

exTabDisplay.prototype.clear = function() {
    this.context.fillStyle = this.bg;
    this.context.beginPath();
    this.context.rect(0,0, 640, this.cxh);
    this.context.fill();
}

// given a MIDI tone and a place on the measures, draw. 
exTabDisplay.prototype.drawPluck = function(string, fret, tm, ppn) { 
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







////////////////////////////////// exErciseInit: arguments and defaults     
// to make an exErcise, make an init, tweak it, and give it to "new eXercise(init)""
function exErciseInit() {  
    // timer things
    this.bpMeasure = 4;
    this.bpMinute = 60.0;
    this.measCt = 64;
    this.msPerUpdate = 50;

    // key
    this.tonic = 60;
    this.mode = 0; 
    this.tuning = 0; // for tuned hand

    this.exercise = 0;  // note generator selector
    this.argHi = 0; // high argument nibble
    this.argLo = 0; // low arg nib
    this.seed = 0; // for exDeck

    this.canvas = 0; // need a canvas; might as well!
    this.notes = -1; 
    this.score = 0; 
}



///////////////////////////////////
/////////////////////////////////// exErcise: enough infrastructure; make some notes!!
///////////////////////////////////

//////////// init; calls generator 
function exErcise(initr) { 
   // debugger;
    this.timer = new exTimer(initr.bpMinute, initr.bpMeasure, initr.msPerUpdate, initr.measCt);
    this.displ = new exTabDisplay(initr.canvas, this.timer); 
    this.hand = new exTunedHand(); 
    this.hand.setToTuning(initr.tuning);

    this.notes = new exNoteList(); 

    switch (initr.exercise) {
        case 0: this.initRandom(); break; 
        case 1: this.initFromScore(initr.score); break; /// oooo! global from spaaaace!
        //case 2: this.initRandomChord(); break; 
        default: this.initRandom(); break; 
    }
}




exErcise.prototype.initRandom = function() {
    var an = new exNote(); 
    var i, tot, intv, t;

    tot = this.timer.measureCount * this.timer.beatsPerMeasure; 
    intv = this.timer.beatInterval; 
    intvs = [0.0, 0.25, 0.5, 1.0, 2.0]; 

    t = 0; 
    while (t<tot) { 
        an.t = t; 
        an.fret = Math.floor(Math.random()*6); 
        an.string = Math.floor(Math.random()*6); 

        this.notes.add(an); 

        gapSel = Math.floor(Math.random()*5.0);
        gap = intv * intvs[gapSel];
        t+= intv;  
    }
}



exErcise.prototype.initFromScore = function() {
    var an = new exNote(); 
    var i, subnl, nll, tn, mintv, mi, mt;

    console.log(aNoteList.title);
   
    subnl = aNoteList.notes;
    nll = subnl.length - 1; 
    tn = aNoteList.tuning;

    this.timer.beatsPerMinute = aNoteList.beatsPerMinute;; 
    this.timer.beatsPerMeasure = aNoteList.beatsPerMeasure; 
    this.measureCount = aNoteList.notes[nll].m; 
    this.timer.restart(); 

    mintv = this.timer.measureInterval; 

    for (i=0; i<nll; i=i+1) {
        mi = subnl[i].m;
        an.string = 5- subnl[i].s;
        an.fret = subnl[i].f;
        mt = subnl[i].t;
        an.t = (mi+mt) * mintv;

        this.notes.add(an); 
    }
}




// draws on canvas using timer
exErcise.prototype.updateAndDraw = function() {
    this.timer.advance(); 
    this.displ.redrawer(this.notes);
} 

exErcise.prototype.restart = function() {
    this.timer.restart(); 
} 





