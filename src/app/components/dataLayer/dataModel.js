angular.module('data')


  .factory('baseModel', function(){
    return {
      validateProps: function(item, properties){
        var dataToSave = {};
        _.each(item, function(val, key){
          console.log(val, key);
          if(_.contains(properties, key)){
            dataToSave[key] = val;
          }
        });
        return dataToSave;
      }
    }
  })


  .factory('physicalBeacon', function(baseModel, data){

    var PhysicalBeacon = function(beaconId, uuid, majorNumber, minorNumber){
      var pBeacon = this;
      this.endpoint = '/physicalBeacons';
      this.beaconId = beaconId;
      this.majorNumber = majorNumber;
      this.minorNumber = minorNumber;
      this.uuid = uuid;
      this.floorPlanLocation = {x: 0, y: 0};
      this.props = ['uuid', 'beaconId', 'majorNumber', 'floorPlanLocation', 'timeOn', 'minorNumber', 'isDetectableByClient'];
      this.save = function(){
        return data.save(baseModel.validateProps(pBeacon, this.props), pBeacon.endpoint);
      }
    };

    return {
      PhysicalBeacon: PhysicalBeacon
    }
  })

  .factory('placeModel', function(baseModel){
    var properties = ['name', 'description', 'phone', 'type', 'geoRadius', 'geo', 'floorPlanUrl', 'id', 'address', 'floorPlanId'];
    return {
      validateProps: function(place){
        return baseModel.validateProps(place, properties);
      }
    }
  })

  .factory('beaconModel', function(baseModel){
    var properties = ['name', 'description', 'visibleOnMap',  'locked', 'id', 'config', 'beaconSchedulerOn', 'lockMessage', 'learnedSpellId'];
    return {
      validateProps: function(beacon){
        return baseModel.validateProps(beacon, properties);
      }
    }
  })

;
