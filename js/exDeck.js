


// the exDeck class is where I get all of the stochastic bits. 
// use .seed to set yourself up for a specific sequence of shuffled numbers. 
// use .next to step through them; it returns a number, 0-255-- each one in 
// the same order, every time. 

// I used .generate to make the standard value for this.ns
// But only the one time. That way, you can get the same random composition
// many times. 

// yes, I'm sure many JS implementations use identical pseudorandom generators.



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

exDeck.prototype = {
    copy: function(it) { 
        this.place = it.place; // everything else should be a class constant. better idiom?  
    },

    seed: function(which) { 
        this.place = which % this.sz; 
    },

    nextI: function() { 
        var res = this.ns[this.place];
        this.place = this.place +1; 
        if (this.place>=this.sz) { 
            this.place = 0; 
        }
        return res; 
    },

    nextF: function() {
        var res = this.factor;
        res *= this.nextI(); 
        return res; 
    },

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
}

module.export = exDeck;
