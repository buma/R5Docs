# GraphQl R5 Documentation

For testing GraphQL [GraphiQL](https://github.com/graphql/graphiql) is great. It also shows documentation (names and description of API).

index.html file is already built graphiQL so node.js is not needed. It also has URL set to default R5 GraphiQL URL:`http://localhost:8080/otp/routers/default/index/graphql`.

GraphQL server needs to be running before starting GraphiQL since it uses GraphQL server to get GraphQL schema to show documentations and for validation.

Graphl API is also used on [new Debug API](http://localhost:8080/new.html).

## GraphQl Schema:
![Example graph](https://rawgit.com/buma/R5Docs/master/resources/schemaDiagram.svg)

[Schema.json](https://github.com/buma/R5Docs/blob/master/resources/graphqlSchema.json)

Example request (This uses GraphQl variables) Currently accessModes and other values that accept list can't be used as GraphQL variables since they can't be deserialized):
```javascript
query requestPlan($fromLat:Float!, $fromLon:Float!,
  $toLat:Float!, $toLon:Float!,
$fromTime: ZonedDateTime!, $toTime:ZonedDateTime!) {
  plan(fromLat:$fromLat, fromLon:$fromLon,
  toLat:$toLat,toLon:$toLon,
  fromTime:$fromTime, toTime:$toTime, directModes:[CAR, WALK],
  accessModes:[WALK, BICYCLE], egressModes:[WALK],
transitModes:[BUS]) {
  
 patterns{tripPatternIdx, routeId, routeIdx}
  
  options {
    summary,
    itinerary {
      waitingTime
      walkTime
      distance
      transfers
      duration
      transitTime
      startTime
      endTime,
      connection {
      #this is index in access array
        access 
        #this is index in egress array
        egress,
        #this is array with all transit segment. Each transitSegment is one part of transit journey. If there are multiple there are transfers
        #transit index is same here as in transit array so if there are two transit elements with first first transitSegment is meant and with second second
        transit {
        #pattern index of pattern in specific transitSegment
          pattern
          #time index of from/to times in specific pattern
          time
        }
      }
    
    }
    
    
    transit {
      from {
        name,
        code
        stopId,
        zoneId,
        lon,
        lat,
      },
       to {
        name,
        code
        stopId,
        zoneId,
        lon,
        lat,
      },
      mode,
      routes {id routeIdx shortName, mode},
      #this is array which index is specified in itinerary.transit.pattern
      segmentPatterns {
      #this is Transport network pattern 
      #Rest of Trip info is in patterns with corresponding tripPatternIdx
        patternIdx
        #to find route info search in routes array is needed since GraphQL doesn't support maps
        routeIdx
        fromIndex
        toIndex,
        #this are arrays which index is specified in itinerary.connection.transit.time
        fromDepartureTime
        toArrivalTime
        
     
      }
      #is non null if there are transfers this is path between last stop of this transitSegment and to first of next mode is always WALK
      middle {
        mode
        duration
        distance
        geometryGeoJSON
      }
    },
    
    access {
      mode,
      duration,
      distance,
      geometryWKT,
      

      streetEdges {
        edgeId
        distance
        geometryWKT
        mode
        streetName
        relativeDirection
        absoluteDirection
        stayOn
        area
        exit
        bogusName,
        bikeRentalOnStation {
          id,
          name,
          lat,lon
        }
      }
    },
     egress {
      mode
     

      streetEdges {
        edgeId
        distance
        geometryPolyline
        mode
        streetName
        relativeDirection
        absoluteDirection
        stayOn
        area
        exit
        bogusName,
        bikeRentalOnStation {
          id,
          name,
          lon,lat
        }
      }
    }
  } 
  }
  
  #patterns{patternId, startTime, endTime, realTime, arrivalDelay, departureDelay}
} 
```
Return format is mostly the same as previous profile response. The biggest difference is that itinerary object is added which specifies specific trip.
Some information about return format can be found [here](https://github.com/conveyal/r5/issues/48#issuecomment-165480575).

And how to interpret it can be seen in [graphql_plan.js](https://github.com/conveyal/r5/blob/graphQL/src/main/resources/debug-plan/scripts/graphql_plan.js#L408).
