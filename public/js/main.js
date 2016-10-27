var hotsname = 'http://' + location.hostname;
var port = 3000;
document.addEventListener('keypress', function() { console.log('i pressed a key') })


var vm = new Vue({
    el: '#app',
    data : {
        randomSpells : [],
        spells : [],
        start : false,
        spellCount : 0,
        inputSpell : "",
        presentSpell : "",
        presentCombo : [],
        totalCombos : 0,
        hitSpells : 0,
        missedSpells : 0
    },
    created : function() {
        this.fetchAllSpells();
    },
    watch : {

        inputSpell : function() {
            var spellCount = this.spellCount;
            var inputSpell = this.inputSpell.toUpperCase();
            var presentSpell = this.presentSpell;

            console.log("Spell Count " + spellCount);
            console.log("Input Spell " + inputSpell);
            console.log("Present Spell" + presentSpell);

            if (inputSpell.length === 3 && inputSpell === presentSpell) {
                this.$set(this, 'inputSpell', '');
                this.$set(this, 'hitSpells', this.hitSpells + 1);
                if (spellCount === 3) {

                    return this.completeCombo();
                }
                return this.fetchSpell(spellCount);
            }

            if (inputSpell.length >=3) {
                this.$set(this, 'missedSpells', this.missedSpells + 1);
                this.$set(this, 'inputSpell', '');
            }
        }
    },

    methods : {
        fetchAllSpells: function() {
            var spells =[];

           this.$http({
               url: hotsname + '/spell',
               method: 'GET'
           }).then(function (response) {
               console.log(JSON.stringify(response.body));
               for (var i in response.body) {
                   spells.push(response.body[i]);
               }
               this.$set(this, 'spells', spells);
           }, function (response) {
               //error callback
               console.log("error" +response.data);
           });
       },

       /* Called to make combos and start and after one combo is done.
       */
       makeCombos() {
           //Assigning spell count to 0.
           this.$set(this, 'spellCount', 0);
           var randomSpellArray = [];
           var count = 0;

           while(count<3) {
               var randomSpell = _.random(0,3);
               if (_.indexOf(randomSpellArray, randomSpell) >= 0 ) {
                   continue;
               } else {
                   randomSpellArray.push(randomSpell);
                   count++;
               }
           }
           var presentCombo = [];
           presentCombo.push(this.spells[ randomSpellArray[0] ]);
           presentCombo.push(this.spells[ randomSpellArray[1] ]);
           presentCombo.push(this.spells[ randomSpellArray[2] ]);

           this.$set(this, 'randomSpells', randomSpellArray);
           this.$set(this, 'presentCombo', presentCombo);
           return this.fetchSpell(this.spellCount);
       },

       startTheGame() {
           for (var i in this.randomSpells) {
               console.log(this.spells[this.randomSpells[i]].keys);
           }
           this.$set(this, 'start', 'true');
           console.log("Game started: " + this.start);
           console.log("Present Spell : " + this.spellCount);
           console.log("Spells:" + JSON.stringify(this.spells));
           console.log("Spells-1 " + this.spells[1].keys);

           return this.makeCombos();
       },

       fetchSpell(count) {
           var presentSpell = this.spells[this.randomSpells[count]].keys;
           console.log("Present Spell : " +presentSpell );
           this.$set(this, 'presentSpell', presentSpell);
           this.spellCount++;
           console.log(this.spellCount);
       },

       completeCombo() {
           this.$set(this, 'totalCombos', this.totalCombos + 1)
           this.makeCombos();
       }
   }
});
