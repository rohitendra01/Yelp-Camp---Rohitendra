console.log("Its working");

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('#star-rating label');
    const radios = document.querySelectorAll('#star-rating input[type="radio"]');
    stars.forEach((star, idx) => {
        star.addEventListener('mouseenter', () => {
            for(let i = 0; i < stars.length; i++) {
                stars[i].style.color = i <= idx ? 'gold' : '#ccc';
            }
        });
        star.addEventListener('mouseleave', () => {
            let checkedIdx = -1;
            radios.forEach((radio, i) => { if(radio.checked) checkedIdx = i; });
            for(let i = 0; i < stars.length; i++) {
                stars[i].style.color = i <= checkedIdx ? 'gold' : '#ccc';
            }
        });
        star.addEventListener('click', () => {
            radios[idx].checked = true;
            for(let i = 0; i < stars.length; i++) {
                stars[i].style.color = i <= idx ? 'gold' : '#ccc';
            }
        });
    });
});

maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: campground.geometry.coordinates,
    zoom: 10
});

new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);