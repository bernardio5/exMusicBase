




///////////////////////////////////
/////////////////////////////////// exErcise: enough infrastructure; make some notes!!
///////////////////////////////////
// this stuff is too high-level, probably. 
//

//////////// init; calls generator 
function exErcise(canvas) { 
    //            beats/min   beats/meas,  ms/update,   measure count
    this.timer = new exTimer(120.0, 4, 50, 32);
    this.hand = new exTunedHand();  // guitar, std, 
    this.deck = new exDeck(); 

    this.tonic = 60;
    this.mode = 0; 
    this.exercise = 0;  // note generator selector
    this.seed = 0; // for exDeck

    this.displ = new exTabDisplay(canvas, this.timer); 
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

        this.beatsPerMinute = aNoteList.beatsPerMinute;; 
        this.beatsPerMeasure = aNoteList.beatsPerMeasure; 
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

