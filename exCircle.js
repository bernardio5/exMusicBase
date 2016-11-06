
///////////////////////////////////////////////////
// the circle of fifths. IDK, something. stash utilities here. 

function exCircle() { 
    // going clockwise!
    //          0  1  2   3  4  5   6  7  8   9  10  11
    this.c5 = [ 0, 7, 2,  9, 4, 11, 6, 1, 8,  3, 10, 5 ];

    // the place of each entry in nts
    //    x = this.c5[this.place[x]]
    // this.place=[ 0, 7, 2,  9, 4, 11, 6, 1, 8, 3, 10, 5 ]; 
    // Did not see that coming!
}

// go n steps around, clockwise, up to +/-24 steps
// the intention is to go around <12 steps. 
// if you do more, god help you cause I'm bored. 
exCircle.prototype = {  // seems like these should all be external-- stateless?

    around: function(inp, n) { 
        var inOct = inp%12; 
        var oct = inp-inOct; 
        var inPlace = this.c5[inOct];
        // inplace is where note inp is on the c5ths
        // now, go around. 
        newPlace = (inPlace+n)%12;
        if (newPlace<0) { newPlace+=12; } 
        return this.c5[newPlace] +oct;
    },

    opposite: function(n) { 
        return this.around(n,6); 
    },

    minorEquivalent: function(inp) { 
        return this.around(n,3); 
    }
}


module.exports = exCircle; 

