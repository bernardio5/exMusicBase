

/// exBase.js contains the base classes of musical composition
// the deck, notes, keys, chords, lines, tuned hands

// goal: musical composition toolkit. actual composition will happen in other classes, 
// but this set should provide all the tools. 

// using these classes, make a composition. convert it to a notelist. 
// then display it however. should accomodate static tab display pages and 
// clef-format playback machines. 

// notelist amounts to a format for digital music. 
// I have MIDI im mind





function exTimer(msPerUpdate) { 
    this.t = 0.0;
    this.dt = msPerUpdate / 1000.0; 
}

exTimer.prototype.copy = function(it) { 
    this.t = it.t;
    this.dt = it.dt;
}

exTimer.prototype.advance = function() { 
    this.t += this.dt;
}


/////////////////  timer holds the time and beat. 
/////////////////  measures are present for the sake of updating the notation

function exSignature(bpMin, bpMeas, measCt, timer) { 
    if (timer) { 
        this.tmr = new exTimer(timer.t); 
        this.tmr.copy(timer);
    }

    
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
    this.tmr.copy(it.tmr);

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
    this.tmr.t = 0.0;
    this.measureCount = 0; 
    this.lastMeasureTime = 0.0; 
    this.lastBeatTime = 0.0; 
    this.recalculate(); 
}

// returns void; use didCross to get stuff
exTimer.prototype.recalculate = function() {
    this.beatFraction = (this.tmr.t- this.lastBeatTime)/this.beatInterval; 
    if (this.beatFraction>1.0) { 
        this.didCrossBeat = true; 
        this.beatCounter = Math.floor(this.tmr.t / this.beatInterval); 
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
    this.timtr=e += this.dt; 
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

exTimer.prototype.setNoteMeasure = function(n) { 
    // loop thru notes in list
    /// convert note[i].t to note[i].measure and note[i].beatInMeasure
    // note[i].measure = self.measureForTime(t);
    // note[i].measure = self.measureForTime(t);
    
}


