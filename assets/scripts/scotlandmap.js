'use strict'


var map = L.map('map').setView([57, -5], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch('/assets/gps_tracks/all_tracks.json').then(r => r.json()).then(data => {
    
    L.geoJSON(data, {
        style: feature => {
            if (feature.properties && feature.properties.day) {
                var d = feature.properties.day
                switch (feature.properties.category) {
                    case 'ride': return {color: 'green'};
                    case 'run': return {color: 'red'}
                }
            }
        },
        onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.day) {
                layer.bindPopup(`Day ${feature.properties.day}`);
                layer.on('mouseover', function (e) {
                    this.openPopup();
                });
                layer.on('mouseout', function (e) {
                    this.closePopup();
                });

                if (feature.properties.section == 1) {
                    
                    var campIcon = L.icon({
                        iconUrl: '/assets/images/tent-icon.png',
                        iconSize:     [30, 30] // size of the icon
                        //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                    });
                    var latLng = L.latLng(feature.geometry.coordinates[0][1], feature.geometry.coordinates[0][0])
                    var marker = L.marker(latLng, {icon: campIcon}).addTo(map);
                    L.DomUtil.addClass(marker.getElement(), 'tent-icon');
                }
            }
        },
        pointToLayer: (feature, latlng) => {
            
            var f = feature.properties.file_name;
            f = f.slice(0, f.length-4) + "Thumb.JPG";

            var link = document.createElement('a');
            link.setAttribute('id', `photo-link-${feature.properties.id}`)
            link.setAttribute('href', `/assets/images/Scotland2018/${feature.properties.file_name}`)
            link.setAttribute('data-lightbox', 'Scotland2018')
            link.setAttribute('data-tile', 'Scotland 2018 Cycle')
            var img = document.createElement('img')
            img.setAttribute('src', `/assets/images/Scotland2018/${f}`)
            link.appendChild(img)
            document.body.appendChild(link)

            var photoIcon = L.icon({
                iconUrl: '/assets/images/Scotland2018/' + f
                
                //iconSize:     [38, 95] // size of the icon
                //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
            var marker = L.marker(latlng, {icon: photoIcon}).bindPopup(`
            <p>
            ${feature.properties.time_taken}<br/>
            </p>
            `);

            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            marker.on('click', function (e) {
                link.click()
            })
            return marker;
        }
    }).addTo(map);
})
