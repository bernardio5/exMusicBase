

var note = require('./exNote');


function exNoteList() {
    this.ns = []; // notes
}


exNoteList.prototype = {
    copy: function(it) { 
        this.clear(); 
        it.ns.forEach(function(item, index, array) {
            this.ns.push(item.newCopy()); 
        });
    },


    newCopy: function() { 
        var res = new exNoteList(); 
        res.copy(this);
    },


    add: function(nt) { 
        this.ns.push(nt.newCopy()); 
    },


    addNCopies: function(n, aNote) {
        var i; 
        for (i=0; i<n; i=i+1) { 
            this.add(aNote); 
        }
    },


    addNew: function(t, md) { 
        var nt = new exNote();
        nt.t = t; 
        nt.MIDI = md;
        this.ns.push(nt);   
    },


    length: function() { 
        return this.ns.length; 
    },


    nth: function(which) {  
        return this.ns[(which % this.ns.length)]; 
    },


    getFirst: function(which) {  
        return this.ns[0]; 
    },


    concat: function(it) {  // add it to this
        this.ns.concat(it); 
    },


    selectBy: function(test) {  // return the note for which test returns the lowest number
        var min, best, aVal;
        min = test(this.ns[0]); 
        it.ns.forEach(function(item, index, array) {
            aVal = test(item, index, array);
            if (aVal<min) {
                best = index; 
                min = aVal;
            }
        });
        return this.ns[best];
    },


    sortBy: function(orderTest) {  // use test to order this
        var swap = new exNote; 
        var i, j, bestPlace, len=this.ns.length; 
        // swap sort
        for (i=0; i<len; i=i+1) {
            bestPlace = i; 
            for (j=i+1; j<len; j=j+1) {
                if (orderTest(this.ns[j], this.ns[bestPlace])) { 
                    bestPlace = j; 
                }
            }
            if (bestPlace!=i) { 
                swap.copy(this.ns[i]);
                this.ns[i].copy(this.ns[bestPlace]);
                this.ns[bestPlace].copy(swap);
            }
        }
    },


    cullBy: function(test) {  // keep only notes for which test is true
        var i, newLen, len = this.ns.length; 
        var res = [];
        newLen = 0; 
        for (i=0; i<len; i=i+1) {
            if (test(this.ns[i])) {
                res[newLen] = this.ns[i];
                newLen = newLen+1;  
            }
        }
        this.ns = res; 
    },


    apply: function(xformer) { // use this.ns[i] = xformer(this.ns[i]) for all
        var i, len = this.ns.length; 
        for (i=0; i<len; i=i+1) {
            xformer(this.ns[i]);   
        }
    },


    applyIndex: function(xformer) { // use this.ns[i] = xformer(this.ns[i], i) for all
        var i, len = this.ns.length; 
        for (i=0; i<len; i=i+1) {
            xformer(this.ns[i], i);   
        }
    },


    applyNoteList: function(xformer, aNoteList) { // use this.ns[i] = xformer(this.ns[i], i, nL) for all
        var i, len = this.ns.length; 
        for (i=0; i<len; i=i+1) {
            xformer(this.ns[i], i, aNoteList);   
        }
    },


    sortByT: function() { // sort this by t
        var testerFun = function(n1, n2) { 
            var res = false; 
            if (n1.t<n2.t) { res=true; }
            return res; 
        }
        this.sortBy(testerFun); 
    },


    cullByRange: function(t0, t1) {  // remove 
        var testerFun = function(n1) { 
            var res = false; 
            if ((t0<=n1.t)&&(n1.t<=t2)) { res=true; }
            return res; 
        }
        this.cullBy(testerFun); 
    },


    cullByMIDIList: function(listTest, noteList) {  // remove 
        // cull; only notes in notelist pass
        this.sortByT(); 
        var testerFun = function(n1) { 
            var res = false; 
//            var i;
  //          if ((t0<=n1.t)&&(n1.t<=t2)) { res=true; }
            return res; 
        }
        this.cullBy(testerFun); 
    },


    clear: function() { 
        this.ns = []; 
    },


    report: function() { 
        console.log("<noteList>");
        this.apply(function (note, index) { 
            console.log("  index:"+index);
            note.report(); 
        });
        console.log("</noteList>");
    },


    tester: function() { 
        // jeez
    }

}

//module.export = exNoteList;
