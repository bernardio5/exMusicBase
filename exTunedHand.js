


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

// exTextTab uses a tunedHand to track what strings and stuff. 

// each motif has a hand. 


var exNote = require('./exNote');



function exTunedHand() {
    this.hand = 0; 
    this.across = 0;        // finger across all strings-- or only some? to do. 0=>none
    this.acrossBase = -1;   // if !=-1, the across finger is on all strings greater than this. 

    this.setToTuning(0); 

    // the notes one can reach with this tuning and this hand. 
    this.available = new exNoteList(); 
}
   

exTunedHand.prototype = { 
    copy: function(it) { 
        this.hand = it.hand; 
        this.across = it.across;
        this.acrossBase = it.acrossBase;
        this.setToTuning(it.tuning); 
    },


    setToTuning: function(which) { 
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
    },


    setHandPlace: function(place) { 
        this.hand = place; 
        this.across = 0; 
    },


    setBarre: function(place, lowest) { 
        this.hand = place; 
        this.across = place; 
        this.acrossBase = lowest; // the lowest string your finger's across. 
    },


    setAvailable: function(keyOrChord) { 
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
    },

    // given a note, set its fret and string
    setANote: function(aNote) { 
        var i, min, minStr; 
        min = 9999; 
        minStr = -1; 
        for (i=0; i<numStrings; i=i+1) { 
            dif = aNote.MIDI - this.strings[i]; 
            if ((dif>=0) && (dif<min)) { 
                min = dif; 
                minStr = i; 
            }
        }
        aNote.string = minStr; 
        aNote.fret = min; 
    }
}


module.export = exTunedHand;



