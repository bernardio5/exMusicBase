

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




exErcise.prototype = { 
    initRandom: function() {
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
    },


    initFromScore: function() {
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
    },


    // draws on canvas using timer
    updateAndDraw: function() {
        this.timer.advance(); 
        this.displ.redrawer(this.notes);
    }, 


    restart: function() {
        this.timer.restart(); 
    } 
}

