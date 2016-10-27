var hotsname = 'http://' + location.hostname;
var port = 3000;
new Vue({
    el: '#app',
    data : {
        spell : {name :'' , mana_cost: '', keys : '', description : '', image : ''},
        spells : []
    },

    created : function () {
        this.fetchSpells();
    },

    methods : {
         fetchSpells : function () {
                var fetchSpellArray = [];
                this.$http({
                    url: hotsname  +  '/spell',
                    method: 'GET'
                }).then(function (response) {
                    for (var i in response.body) {
                        fetchSpellArray.push(response.body[i]);
                    }
                }, function (response) {
                    console.log("error" +response.data);
                });
                this.$set(this, 'spells', fetchSpellArray);
         },
         addSpell : function () {
            var newSpell = {
                name : this.spell.name,
                mana_cost : this.spell.mana_cost,
                keys : this.spell.keys,
                description : this.spell.description,
                image : this.spell.image
            };
            this.$http.post( hotsname +  '/spell' , newSpell).then(function(response) {

                if (response.error) {
                    console.log("Error : Failed to update " );
                    return;
                }
                console.log("Successfully updated");
                this.spells.push(newSpell);

            }, function(response) {
                console.log("Something went wrong");
            });

         }
   }
});
