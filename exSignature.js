


/////////////////  timer holds the time and beat. 
/////////////////  measures are present for the sake of updating the notation

function exSignature(bpMin, bpMeas, measCt, t, dt) { 
    this.t = t; 
    this.dt = dt; 
    
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


exTimer.prototype = { 
    copy = function (it) {  
        this.t = it.t;
        this.dt = it.dt; 

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
    }, 


    restart: function() { 
        this.tmr.t = 0.0;
        this.measureCount = 0; 
        this.lastMeasureTime = 0.0; 
        this.lastBeatTime = 0.0; 
        this.recalculate(); 
    },

    // returns void; use didCross to get stuff
    recalculate: function() {
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
    },


    advance = function() { 
        this.timtr=e += this.dt; 
        this.recalculate(); 
    },

    // the point of lines is, not everything happens on THE beat. 
    timeOfNthBeat: function(n) { 
        return this.beatInterval * Math.floor(n); 
    },

    beatForTime: function(t) { 
        return Math.floor(t/this.beatInterval);
    },

    timeOfNthMeasure: function(n) { 
        return this.measureInterval * Math.floor(n); 
    },

    measureForTime: function(t) { 
        return Math.floor(t/this.measureInterval);
    },

    measureOfNthBeat: function(n) { 
        return Math.floor(n/this.beatsPerMeasure); 
    },

    beatOfNthMeasure = function(n) { 
        return Math.floor(b/this.beatsPerMeasure); 
    },

}
