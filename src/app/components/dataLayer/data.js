angular.module('data', [])
  .factory('data', function ($http, baseUrl, $q, $timeout, placeModel, $mdToast, currentPlace) {
    var findOne = function (url, id, include) {
      var config = {
        method: "GET",
        url: baseUrl + url + '/findOne',
        params: {
          filter: {
            where: {id: id},
            include: include

          }
        }
      };
      return $http(config);
    };

    var _http = function (config) {
      config.url = baseUrl + config.url;
      return $http(config);
    };

    var beaconInclude = ['cards', 'learnedSpell', 'backgroundArtifact', 'quests', 'physicalBeacons', 'config', {
      relation: 'messages',
      scope: {include: {relation: 'character', scope: {include: 'avatar'}}}
    }];

    var spellIncludes = [{relation: 'character', scope: {include: 'avatar'}}];
    var messageInclude = [{relation: 'character', scope: {include: 'avatar'}}];
    var placeIncludes = [{relation: 'beacons', scope: {include: beaconInclude}}];
    var battleIncludes = [{relation: 'monsters', scope: {include: 'avatar'}}];
    var characterIncludes = ['avatar'];

    var service = {
      loadBeacon: function (beaconId) {
        return findOne('/api/beacons', beaconId, beaconInclude);
      },

      setPhysicalBeacon: function(beaconId, pBeaconId){
        var config = {method: "POST", url: "/api/beacons/" + beaconId + "/setPhysicalBeacon", data: {physicalBeaconId: pBeaconId}};
        return _http(config);
      },
      getVersion: function(){
        var config = {method: "GET", url: '/api/serverInfos/api-version'};
        return _http(config).then(function(res){
          console.log("API_VERSION: ", res.data);
          return res.data;
        })
      },
      getMajorMinorOptions: function(placeId){
        var config = {method: "GET", url: '/api/places/' + placeId + "/getMajorMinorOptions"};
        return _http(config);
      },
      lookupAddress: function(place){
        var address = [];
        _.each(place.address, function(val, key){
          address.push(val + ' ');
        });
        address = address.join('');
        console.log(address);
        var config = {method: "GET", url: '/api/places/coordinates', params: {address: address}};
        return _http(config);
      },
      loadPlace: function (placeId) {
        return findOne('/api/places', placeId, placeIncludes);
      },
      loadBeaconsForPlaceId: function (placeId) {
        var config = {method: "GET", params: {filter: {where: {placeId: placeId}, include: beaconInclude}}, url: '/api/beacons'};
        return _http(config);
      },
      loadSpell: function (spellId) {
        return findOne('/api/availableSpells', spellId, spellIncludes);
      },
      loadBattle: function (battleId) {
        return findOne('/api/battles', battleId, battleIncludes);
      },
      loadBattleSpell: function (spellId) {
        return findOne('/api/battleSpells', spellId, spellIncludes);
      },
      loadCards: function () {
        return _http({method: "GET", url: '/api/cards'});
      },
      loadBeaconCards: function () {
        return _http({method: "GET", url: '/api/beaconCards'});
      },
      loadTutorialSlides: function () {
        return _http({method: "GET", url: '/api/tutorials', params: {filter: {include: 'artifact'}}});
      },
      loadQuests: function () {
        return _http({method: "GET", url: '/api/quests', params: {filter: {include: 'beacon'}}});
      },
      loadAccomplishments: function () {
        return _http({method: "GET", url: '/api/accomplishments', params: {filter: {include: ['trophyImage', 'shareTrophyImage']}}});
      },
      loadBeacons: function () {
        return _http({method: "GET", url: '/api/beacons', params: {filter: {include: beaconInclude}}});
      },
      loadPlaces: function () {
        return _http({method: "GET", url: '/api/places', params: {filter: {include: placeIncludes}}});
      },
      loadSpells: function () {
        return _http({method: "GET", url: '/api/availableSpells', params: {filter: {include: spellIncludes}}});
      },
      loadBattleSpells: function () {
        return _http({method: "GET", url: '/api/battleSpells', params: {filter: {include: spellIncludes}}});
      },
      loadMessages: function () {
        return _http({method: "GET", url: "/api/messages", params: {filter: {include: messageInclude}}})
      },
      loadCharacters: function () {
        return _http({method: "GET", url: "/api/characters", params: {filter: {include: characterIncludes}}})
      },
      loadRunes: function () {
        return _http({method: "GET", url: "/api/runes"});
      },
      loadMonsters: function () {
        return _http({method: "GET", url: "/api/monsters", params: {filter: {include: characterIncludes}}})
      },
      loadBattles: function () {
        return _http({method: "GET", url: "/api/battles", params: {filter: {include: {relation: 'monsters', scope: {include: 'avatar'}}}}})
      },
      addMonsterToBattle: function (battleId, monsterId) {
        return _http({method: "PUT", url: "/api/battles/" + battleId + '/monsters/rel/' + monsterId})
      },
      load: function (endpoint) {
        var config = {url: '/api' + endpoint, method: "GET"};
        return _http(config);
      },
      notify: function (id, msg) {
        var config = {method: "POST", url: '/notify/' + encodeURIComponent(id), data: {msg: msg}};
        return _http(config);
      },
      importCards: function (Blobs, cardType) {
        var config = {url: '/api/cards/import', method: "POST", data: {files: Blobs, cardType: cardType}};
        return _http(config);
      },
      importRunes: function (Blobs) {
        var config = {url: '/api/runes/import', method: "POST", data: {files: Blobs}};
        return _http(config);
      },
      loadGameStates: function () {
        var config = {
          method: "GET",
          url: '/api/gameStates',
          params: {filter: {include: 'spellbook'}}
        };
        return _http(config);
      },
      notifyCaster: function (casterStateId, spell) {
        var config = {
          method: "POST",
          url: '/api/spells/' + spell.id + '/notifyCaster',
          data: {casterStateId: casterStateId, triggerMessage: {text: spell.casterSuccessMessage}}
        };
        return _http(config);
      },
      searchSpellsByProfile: function (profileId) {
        var config = {
          url: "/api/profiles/findOne",
          params: {
            filter: {
              where: {id: profileId},
              include: {relation: 'activeGameState', scope: {include: 'spellbook'}}
            }
          },
          method: "GET"
        };
        return _http(config);
      },
      importArtifact: function (Blobs) {
        var config = {url: '/api/artifacts/import', method: "POST", data: {files: Blobs}};
        $("#upload-in-progress").show();
        return _http(config).then(function(res){
          $("#upload-in-progress").hide();
          return res;
        });
      },
      addCardToBeacon: function (card, beaconId) {
        var config = {method: 'PUT', url: '/api/beacons/' + beaconId + '/cards/rel/' + card.id};
        return _http(config);
      },
      updateBeaconCard: function (card, beaconId) {
        var config = {method: 'PUT', url: '/api/beacons/' + beaconId + '/cards/rel/' + card.id, data: card};
        return _http(config).then(function(res){
          console.log(res);
          if(res.status === 200){
            $mdToast.show(
              $mdToast.simple()
                .content('Update Successful')
                .position('top right')
                .hideDelay(2000)
            );
          }
          else{

          }
          return res;
        }, function(err){
          $mdToast.show(
            $mdToast.simple()
              .content('Update Failure')
              .position('top right')
              .hideDelay(2000)
          );
          return err;
        });
      },
      setBackgroundForBeacon: function (beacon, artifactId) {
        var config = {
          method: "POST",
          url: '/api/beacons/' + beacon.id + '/setBackground',
          data: {artifactId: artifactId}
        };
        return _http(config);
      },
      removeCard: function (card, beaconId) {
        var config = {url: '/api/beacons/' + beaconId + '/cards/rel/' + card.id, method: "DELETE"};
        return _http(config);
      },
      setCharacterAvatar: function (character, artifactId) {
        var config = {
          method: "POST",
          url: '/api/characters/' + character.id + '/setAvatar',
          data: {artifactId: artifactId}
        };
        return _http(config);
      },
      setTrophy: function (accomplishment, artifactId, field) {
        console.log(field);
        var config = {
          method: "POST",
          url: '/api/accomplishments/' + accomplishment.id + "/setTrophyImage",
          data: {artifactId: artifactId, fieldName: field}
        };
        return _http(config);
      },
      setMonsterAvatar: function (monster, artifactId) {
        var config = {
          method: "POST",
          url: '/api/monsters/' + monster.id + '/setAvatar',
          data: {artifactId: artifactId}
        };
        return _http(config);
      },
      copyCard: function (card) {
        delete card['id'];
        var config = {url: '/api/cards', data: card, method: "POST"};
        return _http(config);
      },
      replaceCard: function (Blobs, cardType, card) {
        var deferred = $q.defer();
        $("#upload-in-progress").show();
        var config = {url: '/api/cards/import', method: "POST", data: {files: Blobs, cardType: cardType}};
        _http(config).then(function (res) {
          $("#upload-in-progress").hide();
          console.log(res.data);
          var replaceConfig = {
            method: "POST",
            url: '/api/cards/' + card.id + "/replace",
            params: {originalCard: res.data[0]}
          };
          _http(replaceConfig).then(function (res) {
            deferred.resolve(res.data);
          })
        }).catch(function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      loadWinners: function (window) {
        var deferred = $q.defer();
        //var params = {};
        //if(filters.startTime){
        //  params.startTime = filters.startTime;
        //  if(filters.stopTime){params.stopTime = filters.stopTime}
        //}
        //else if(filters.window){
        //  params.window = filters.window;
        //}
        //else{
        //  params.window = 'allTime';
        //}
        //console.log(filters);
        window = 'allTime';
        if(!window){window='allTime'}
        var config = {
          method: "GET",
          url: '/api/gameStates/getLeaderBoard',
          params: {window: window}
        };

        _http(config).then(function (res) {
          _.each(res.data, function(winner){
            winner.startTimeTime = new Date(winner.startTime).getTime()
            winner.stopTimeTime = new Date(winner.stopTime).getTime()
          });
          deferred.resolve(res.data);
        }).catch(function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      removeRelation: function(parentClass, parentId, childId, relation){
        var config = {method:"DELETE", url: '/api/' + parentClass + '/' + parentId + '/' + relation + '/rel/' + childId};
        return _http(config);
      },
      loadActiveSpellsForBeacon: function(beaconId){
        var config = {method: "GET", url: '/api/castSpells', params: {filter: {where: {beaconId: beaconId}}}};
        return _http(config);
      },
      loadActiveSpells: function(){
        var config = {method: "GET", url: '/api/castSpells', params: {filter: {include: ['spell', 'beacon'], where: {remaining: {neq: 0}}}}};
        //var config = {method: "GET", url: '/api/castSpells'};
        return _http(config);
      },
      resetActiveSpells: function () {
        var config = {method: "POST", url: '/api/castSpells/resetActiveSpells'};
        return _http(config);
      },
      resetActiveGameStates: function () {
        var config = {method: "POST", url: '/api/gameStates/resetAllActiveGameStates'};
        return _http(config);
      },
      save: function (item, endpoint) {
        if(!item.id){
          console.log('should be creating instead of saving');
          return service.create(item, endpoint);
        }
        else{
          var config = {url: '/api' + endpoint + "/" + item.id, method: "PUT", data: item};
          return _http(config).then(function(res){
            console.log(res);
            if(res.status === 200){
              $mdToast.show(
                $mdToast.simple()
                  .content('Update Successful')
                  .position('top right')
                  .hideDelay(2000)
              );
            }
            else{

            }
            return res;
          }, function(err){
            $mdToast.show(
              $mdToast.simple()
                .content('Update Failure')
                .position('top right')
                .hideDelay(2000)
            );
            return err;
          })
        }
      },
      create: function (item, endpoint) {
        var config = {url: '/api' + endpoint, data: item, method: "POST"};
        return _http(config).then(function(res){
          console.log(res);
          if(res.status === 200){
            $mdToast.show(
              $mdToast.simple()
                .content('Update Successful')
                .position('top right')
                .hideDelay(2000)
            );
          }
          else{

          }
          return res;
        }, function(err){
          $mdToast.show(
            $mdToast.simple()
              .content('Update Failure')
              .position('top right')
              .hideDelay(2000)
          );
          return err;
        });
      },
      delete: function (item, endpoint) {
        var config = {method: "DELETE", url: "/api" + endpoint + "/" + item.id};
        return _http(config).then(function(res){
          $mdToast.show(
            $mdToast.simple()
              .content('Update Successful')
              .position('top right')
              .hideDelay(2000)
          );
          return res;
        }, function(err){
          $mdToast.show(
            $mdToast.simple()
              .content('Update Failure')
              .position('top right')
              .hideDelay(2000)
          );
          return err;
        });
      },
      fetchCards: function () {
        var cards = {};
        var deferred = $q.defer();
        service.loadCards().then(function (res) {
          cards.gameCards = res.data;
          cards.rareCards = _.where(res.data, {cardType: 'rare'});
          cards.commonCards = _.where(res.data, {cardType: 'common'});
          cards.uncommonCards = _.where(res.data, {cardType: 'uncommon'});
          deferred.resolve(cards);
        })
          .catch(function (err) {
            deferred.reject(err);
          });
        return deferred.promise;
      },

      loadNewUsers: function(startDate, stats){
        var config = {method: "GET", url:'/api/profiles', params: {filter: {where: {createdDate: {gt: startDate}}, include: 'installations'}}};
        return _http(config).then(function(res){
          stats.newUsers = res.data;
          console.log(res.data);
          stats.androidUsers = _.where(stats.newUsers, function(user){
            //console.log(user);
            if(user.installations.length){ return user.installations[0].deviceType === 'android'}
          });
          stats.iosUsers = _.where(stats.newUsers, function(user){
            if(user.installations.length){ return user.installations[0].deviceType === 'ios'}
          });
          return stats;
        })
      },
      loadQuestStats: function(startDate, stats){
        var config = {method: "GET", url:'/api/gameStateQuests', params: {filter: {where: {createdDate: {gt: startDate}}, include: 'quest'} }};

        return _http(config).then(function(res){
          stats.questsByOrder = _.groupBy(res.data, function(quest){ if(quest.quest){ return quest.quest.order}});
          stats.allQuests = res.data;
          stats.completedQuests = _.where(stats.allQuests, {completed: true});
          stats.completedQuestsByOrder = _.groupBy(stats.completedQuests, function(quest){ if(quest.quest){return quest.quest.order}});
          return stats;
        })
      },

      getStonefireClosers: function(startDate, stats){
        var config = {method: 'GET', url:'/api/gameStates', params: {filter:{where: {createdDate: {gt: startDate}, stopTime: {neq: null}}, include: 'profile'}}};
        return _http(config).then(function(res){
          stats.stonefireClosers = res.data;

        })
      },
      gatherAnalytics: function(startDate){
        var deferred = $q.defer();
        startDate = startDate ? new moment(startDate).toISOString() : new moment().startOf('day').subtract(1, 'd').toISOString();
        //startDate = startDate + "Z";
        var calls = [];
        var stats = {};
        calls.push(service.getStonefireClosers(startDate, stats));
        calls.push(service.loadNewUsers(startDate, stats));
        calls.push(service.loadQuestStats(startDate, stats));
        //calls.push(service.loadQuests(startDate, stats));

        $q.all(calls).then(function(){
          console.log(stats);
          deferred.resolve(stats);
        }).catch(function(){
          console.log("UH OH SOMETHING WENT BOO BOO!");
        });
        return deferred.promise;
      }
    };

    return service;
  })
;
