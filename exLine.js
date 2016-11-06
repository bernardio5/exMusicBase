

/////////////////  exLine excapsulates a repeated bit of drumming. 
///////////////// many lines make a rhythm. 

// the timer object is the home of the tempo-- the beats per second. 
// it also has a "measure" length, but lines and rhythms ignore it. 
// lines do not use the timer?
// rhythms do. there is only one tempo; you have to share it.

// lines contain dealings of notes onto hits. this is a second list, 
// same length as first, of random numbers, that place chord notes onto hits. 

// if there IS no timer, then the concept of measure lives here. 

 
var exNote = require('./exNote');
var exNoteList = require('./exNoteList');



function exLine(aDeck) {
    this.deck = new exDeck(); 
    this.deck.copy(aDeck); 
    // how many beats of the timer per rep 
    this.beatCount = 4; 
    this.beats = [1, 0, 0, 0]; // which beats to use, an array of 0's and 1's
    this.deals = [0, 1, 2, 3]; // the notes of the chord placed onto them
    // how we divide that time up; ==|beats|
    this.intervals = this.beats.length;     
    this.notes = new exNoteList(); 
}

exLine.prototype = {

    copy: function(it) { 
        this.deck.copy(it.deck); 
        this.beatCount = it.beatCount; 
        this.beats = [];
        this.deals = [];
        for (var i=0; i<it.beatCount; i=i+i) {
            this.beats[i] = it.beats[i];
            this.deals[i] = it.dealss[i];
        }
        this.intervals = this.beats.length;
        this.notes.copy(it.notes);
    },


    seed: function(x) { this.deck.seed(x); }


    // sets using an int, beats per measure, and an array of all beats. Ex: 4,[1,0,1,0]; 8,[0,0,1,1,0,0,0,0]
    setFromFull: function(count, list) {
        this.beatCount = count; 
        this.beats = list; 
        this.intervals = this.beats.length;     
    },


    // sets using an int, beats per measure, and an array of all beats. Ex: 4,[1,1]
    setFromUsed: function(count, intv, list) {
        this.beatCount = count;
        this.beats = []; 
        var i = 0; 
        for (i=0; i<intv; i=i+1) { 
            this.beats[i] = 0; 
        } 
        for (i=0; i<list.length; i=i+1) {
            this.beats[list[i]]=1;
        }
        this.intervals = this.beats.length; 
    },

    // sets using an int, beats per measure, and a bit pattern. Ex: 16,0xf080
    //setFromBits : function(count, list) {
    //    this.beatCount = count; 
    //    this.beats = list; 
    //}

    generateEventsForTimes: function(timer, t0, t1, lineTag) { 
        var btIntrv, myIntrv, lastT, endNotCrossed; 
        var lastT, nextT, interIntrv, thisT, intervStartT, i, n;
        this.currentBeats = []; 

        btIntrv = timer.beatInterval; 
        myIntrv = this.beatCount * btIntrv;
        thisMeas = Math.floor(t0/myInterv);  
        measStartT = thisMeas * myIntrv; 
        myBeatIntrv = (btIntrv * this.beatCount)/this.intervals; 
        endNotCrossed = 0; 
        
        n = 0; 

        while (endNotCrossed==0) { 
            intervStartT = measStartT + (n*myIntrv);     
            for (i=0; i<this.intervals; i=i+1) { 
                if (this.beats[i]==1) { 
                    thisT = measStartT +(i*myBeatIntrv); 
                    if ((t0<=thisT) && (thisT<t1)) { 
                        this.currentBeats.push([thisT, i, lineTag]);
                    }
                    if (thisT>t1) { 
                        endNotCrossed = 1; 
                    }
                }
            }
            n=n+1;
        }
    }

    // remove percent of the used beats
    thin: function(deck, percent) { 
        var i; 
        for (i=0; i<this.intervals; i=i+1) {
            if (this.beats[i] == 1) { 
                if (deck.nextF()<percent) {
                    this.beats[i] =0; 
                }
            }
        }
    }

    // set percent of the used beats
    thicken: function(deck, percent) { 
        var i; 
        for (i=0; i<this.intervals; i=i+1) {
            if (this.beats[i] == 0) { 
                if (deck.nextF()<percent) {
                    this.beats[i] =1; 
                }
            }
        }
    }

    reverse: function() { 
        var i, s, ct, j;
        ct = Math.floor(this.intervals/2.0); 
        for (i=0; i<ct; i=i+1) {
            j = this.intervals - i; 
            s = this.beats[i]; 
            this.beats[i] = this.beats[j]; 
            this.beats[j] = s; 
        }
    }

    // n times as long, repeating
    multiply: function(n) {
        var i, ct;
        var newList = []; 
        ct = Math.floor(this.intervals*n);  
        j= 0; 
        for (i=0; i<ct; i=i+1) {
            newList.push(this.beats[j]);
            j=j+1;   
            if (j>=this.intervals) { j=0; }
        }
    }

    // superimpose. length of this is not changed. it loops if short
    superimpose: function(it) {
        var i, ct;
        var newList = []; 
        ct = Math.floor(this.intervals*n);  
        j= 0; 
        for (i=0; i<ct; i=i+1) {
            newList.push(this.beats[j]);
            j=j+1;   
            if (j>=this.intervals) { j=0; }
        }
    }

    // clears events between start and stop
    wipe: function(start, stop) {
        var i1, i2, i;
        if (start<stop) {   
            i1 = start;
            i2 = stop; 
            if (i1<this.intervals) { 
                if (i2>=this.intervals) { i2 = this.intervals; }
                for (i=i1; i<i2; i=i+1) { this.beats[i] = 0; }
            } 
        }
    }

    // removes one event 
    removeNth: function(n) { 
        if (n<this.intervals) { this.beats[n] = 0; }
    }

    // beats<=n ==1, 0 ow
    setToFirstN: function(n) { 
        var i, ct;
        var newList = []; 
        ct = Math.floor(this.intervals*n);  
        j= 0; 
        for (i=0; i<ct; i=i+1) {
            newList.push(this.beats[j]);
            j=j+1;   
            if (j>=this.intervals) { j=0; }
        }
    }

    // repeat an a+1-length pattern, 1,0,0,..
    setToEveryN: function(n, skipfirst) { 
        var i, j; 
        for (i=0; i<this.intervals; i=i+1) { 
            if (i%n==skipfirst) { 
                this.beats[i] = 1; 
            } else {
                this.beats[i] = 0; 
            }
        }
    }

    // n 0's 
    setToEmptyLength: function(n) { 
        var i; 
        this.beats = []; 
        for (i=0; i<n; ++i) {
            this.beats.push(0); 
        }
    }

    // for each, p% chance of being a 1
    randomize: function(density) {
        var i, q;
        for (i=0; i<this.intervals; i=i+1) {
            if (deck.nextF()<density) { this.beats[i] = 1; }
        }
    }
}

module.export = exLine;






