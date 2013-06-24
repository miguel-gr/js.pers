
/**
 * Persistence.
 */

Dao = Class.extend({
  name:"",
	ids:new Array(),
	init: function(entityName) {
        this.name = entityName;
        this.ids = this.loadIds();
	},

    // Save or updates an entity
    save: function(entity){
        var id = this.getEntityId(entity);
        if(!id){ // New Id
            id = this.getMaxId()+1;
            entity.id = id;
        }
        var name = this.name+":"+id;
        window.localStorage.setItem(name, JSON.stringify(entity));
        this.adId(id);
    },

    // Get an entity by its id, null if not found
    get: function(id){
        var obj = JSON.parse(window.localStorage.getItem(this.name+":"+id));
        return obj;
    },

    // Get all entities
    getAll: function(){
        var res = [];
        for(var i=0; i<this.ids.length; i++){
            var obj = this.get(this.ids[i]);
            if(obj!=null){
                res.push(obj);
            } else {
                console.info("Should not be null! - "+this.name+":"+i);
            }
        }
        return res;
    },
    
    // Get the id of an entity, returns false if not present
    getEntityId: function(entity){
        var res = parseInt(entity.id);
        if(isNaN(res)) return false;
        return res;
    },
    
    // Get name of the Ids List
    getIdsListName: function(){
        return this.name+":ids";
    },
    
    // load ids
    loadIds: function(){
        var ids = JSON.parse(window.localStorage.getItem(this.getIdsListName()));
        if(ids!=null){
            this.ids = ids;
        }
        return this.ids;
    },
    
    // get max id
    getMaxId: function(){
        if(this.ids.length===0){
            return 0;
        }
        return this.ids[this.ids.length-1];
    },
    
    // Add a new Id if needed
    adId: function(id){
        for(var i=0; i<=this.ids.length; i++){
            if(id===this.ids[i]) return; // Id already added
        }
        this.ids.push(id); // Add new Id
        this.ids.sort(function(a,b){return a - b});
        window.localStorage.setItem(this.getIdsListName(), JSON.stringify(this.ids));
        console.info(this.getAll());
    }
    
});
