




///////////////////// ultimately, arrays of notes
///////////////////// This is more of a data structure than a class.
///////////////////// Very public, members modified from outside, often, 
/////////////////////       used a lot as input for routines. I guess. 
function exNote() { 
    this.t = 0.0; 
    this.midi = 60; 

    this.fret = 0;
    this.string = -1; 

    this.measure = 0; 
    this.beatInMeasure = 0; 

    this.tg = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; 
    // 10 random things to remember
    // part#? difficulty? place in chord?
}


exNote.prototype = { 
    copy: function(it) { 
        this.t = it.t; 
        this.midi = it.midi; 
        this.fret = it.fret; 
        this.string = it.string; 
        this.measure = it.measure; 
        this.beatInMeasure = it.beatInMeasure;
        var i; 
        for (i=0; i<10; i=i+1) {
            this.tg[i] = it.tg[i];
        } 
    },


    newCopy: function() { 
        var res = new exNote(); 
        res.copy(this);
        return res;  
    },


    letter: function() { 
        var index = this.midi % 12;
        var res = '';
        switch (index) { 
            case  0: res = 'C-'; break; 
            case  1: res = 'C#'; break; 
            case  2: res = 'D-'; break; 
            case  3: res = 'D#'; break; 
            case  4: res = 'E-'; break; 
            case  5: res = 'F-'; break; 
            case  6: res = 'F#'; break; 
            case  7: res = 'G-'; break; 
            case  8: res = 'G#'; break; 
            case  9: res = 'A-'; break; 
            case 10: res = 'A#'; break; 
            case 11: res = 'B-'; break; 
        }
        return res; 
    },


    dt: function(it) { 
        return it.t - this.t; 
    },


    dMIDI: function(it) { 
        return it.MIDI - this.MIDI; 
    },


    makeInterval: function(step) { 
        var res = new note();
        res.copy(this);
        // add code to take interval names
        res.MIDI = res.MIDI + step;     
        return res; 
    }, 

    report: function() { 

    },

    tester: function() { 
        // I don't know! Do testy things. 
    }
}

// module.export = exNote; 

