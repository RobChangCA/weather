var air = {};
air.key = `cd842d7bc5cda4c1a7a64b19cb38d889d2e1e221`;
air.aqi = ``;
 
//User input
air.getCity = function(){
	TeleportAutocomplete.init('.my-input').on('change', function(returned) {
		air.getData(returned);
		$('h1').html(returned.name);
		$('.input').addClass('invisible');
		$('h1').addClass('slideInRight');
	});
} 
 
//ajax
air.getData = function(location){
	let aqi = $.ajax({
		url: `https://api.waqi.info/feed/geo:${location.latitude};${location.longitude}/`,
		method: "GET",
		dataType: "json",
		data: {
			token: air.key,
			format: 'json'
		}
	})
	let weather = $.ajax({
		url:`https://api.darksky.net/forecast/da4b3ace237cd614779bc70450a0ae24/${location.latitude},${location.longitude}?units=ca`,
		method: `GET`,
		dataType: `jsonp`,
		data: {
			format: `jsonp`
		},
	})
	$.when(aqi, weather)
	.then(function(aqiReturned, weatherReturned){
		air.display(aqiReturned[0], weatherReturned[0]);
	})
	.fail(function (errAqi, errWeather){
		console.log(`aqi: ${errAqi} weather: ${errWeather} `)
	});
}



//display landing page data
air.display = function(aqi, weather){
	// const pm25 = aqi.data.iaqi.pm25.v;
	const pm25 = aqi.data.iaqi.pm25 ? aqi.data.iaqi.pm25.v : "No data for ";
	const uv = weather.currently.uvIndex;
	const temp = Math.floor(weather.currently.temperature);
	const windFeel = Math.floor(weather.currently.apparentTemperature);
	const weatherDescription = weather.minutely ? weather.minutely.summary : weather.daily.summary;

// animation
	$('.display').addClass('fadeIn');
	$('aside').addClass('fadeIn');
	$('.shader').css('background', 'rgba(0, 0, 0, 0.8)');
	// $('.infoGallery__p').addClass('slideInRight');
 
//initial load
	$('.display__main').html(`${temp}°C`);
	$('.display__info').html(`${weatherDescription}`);
	$('.img__1').attr("src","public/assets/wtemp.svg");
	$('.img__2').attr("src","public/assets/wsun.svg");
	$('.img__3').attr("src","public/assets/whaze.svg");
	
//main 
	$('#side__main').attr('data-temp', temp);
	$('#side__main').attr('data-uv', uv);
	$('#side__main').attr('data-pm25', pm25);
	$('#side__main').attr('data-desc', weatherDescription);

//weather
	$('.imgText__1').html(`${temp}°C`);
	$('.imgTitle__1').html(`Temperature`);
	// $('#side__temp').html(`${temp}°C`);
	$('#side__temp').attr('data-temp', temp);
	$('#side__temp').attr('data-feel', windFeel);
	
//uv
	$('.imgTitle__2').html(`Ultra Violet Index`);
	$('.imgText__2').html(`${uv}UV`);
	// $('#side__uv').html(`${uv}UV`);
	$('#side__uv').attr('data-uv', uv);
	
//AQI
	$('.imgText__3').html(`${pm25} PM2.5`);
	$('.imgTitle__3').html(`Air Quality Index`);
	// $('#side__pm25').html(`${pm25} PM2.5`);
	$('#side__pm25').attr('data-pm25', pm25);
	


//side buttons
	$('.box').on('click', function(){
			var data = $(this).data();
			if(this.id === 'side__main'){
				air.displayMain(data);
			}else if (this.id === 'side__temp'){
				air.displayTemp(data);
			}else if (this.id === 'side__uv'){
				air.displayUV(data);
			}else if (this.id === 'side__pm25'){
				air.displayPM25(data);
			}
		});
}


// display functions
air.displayMain = function(data){
	//Toggle invisible and active
	$('.document__gallery').removeClass('invisible');
	$('.info__gallery').css('display', 'none');
	$('.box').removeClass('black');
	$('#side__main').addClass('black');
	//main text
	$('.display__main').html(`${data.temp}°C`);
	$('.display__info').html(`${data.desc}`);
	//set images
	$('.img__1').attr("src","./public/assets/wtemp.svg");
	$('.img__2').attr("src","./public/assets/wsun.svg");
	$('.img__3').attr("src","./public/assets/whaze.svg");
	//set p text
	$('.imgTitle__1').html(`Temperature`);
	$('.imgTitle__2').html(`Ultra Violet Index`);
	$('.imgTitle__3').html(`Air Quality Index`);
	$('.imgText__1').html(`${data.temp}°C`);
	$('.imgText__2').html(`${data.uv}UV`);
	$('.imgText__3').html(`${data.pm25} PM2.5`);
}



air.displayTemp = function(data){
	//Hide main document gallery and show temp info
	$('.document__gallery').addClass('invisible');
	$('.info__gallery').removeClass('invisible');
	$('.info__gallery').css('display', 'flex');
	$('.box').removeClass('black');
	$('#side__temp').addClass('black');
	//main
	if((data.temp!== data.feel) && (data.temp <= 0 || data.temp >=25)){
		$('.display__main').html(`The current temperature is ${data.temp}°C.  It feels like ${data.feel}`);
	}else{
		$('.display__main').html(`The current temperature is ${data.temp}°C.`);
	}
	//description
	if(data.feel<= -55){
		$('.display__info').html(`VERY DANGEROUS... Good luck! Exposed flesh freezes in less than 2 minutes.`);
		$('.infoGallery__img').attr("src","./public/assets/wzombie.svg");
		$('.infoGallery__p').html(`Stay inside.`);

	}else if (data.feel < -48){
		$('.display__info').html(`Severe risk of death!  Exposed flesh can freeze in 2 to 5 minutes!  Cover EVERYTHING.  I wouldn't go out there...`);
		$('.infoGallery__img').attr("src","./public/assets/wzombie.svg");
		$('.infoGallery__p').html(`Wear extremely warm dry clothing to stay safe.`);

	}else if (data.feel < -40){
		$('.display__info').html(`Very high risk of death!  Exposed flesh can freeze in 5 to 10 minutes.  Cover all exposed skin!`);
		$('.infoGallery__img').attr("src","./public/assets/wzombie.svg");
		$('.infoGallery__p').html(`Wear very warm dry clothing to stay safe.`);

	}else if (data.feel < -28){
		$('.display__info').html(`High risk of death: Exposed flesh can freeze in 10 to 30 minutes.  Cover up!`);
		$('.infoGallery__img').attr("src","./public/assets/wzombie.svg");
		$('.infoGallery__p').html(`Wear very warm dry clothing to stay safe.`);

	}else if (data.feel < -10){
		$('.display__info').html(`Moderate risk of death:  Risk of hypothermia and frostbite is possible if exposed to elements for an extended period of time.`);
		$('.infoGallery__img').attr("src","./public/assets/wcold.svg");
		$('.infoGallery__p').html(`Wear a warm hat and jacket to stay safe.`);

	}else if (data.feel < -0){
		$('.display__info').html(`If you dress warmly and stay dry you should be ok.`);
		$('.infoGallery__img').attr("src","./public/assets/wjacket.svg");
		$('.infoGallery__p').html(`Wear a warm hat and jacket to stay comfortable.`);

	}else if (data.feel < 10){
		$('.display__info').html(`Its pretty chilly and you should wear warm clothing.`);
		$('.infoGallery__img').attr("src","./public/assets/wjacket.svg");
		$('.infoGallery__p').html(`Despite this fact most Canadians are wearing shorts and Tshirts.`);

	}else if (data.feel < 20){
		$('.display__info').html(`Its pretty warm.`);
		$('.infoGallery__img').attr("src","./public/assets/whappyperson.svg");
		$('.infoGallery__p').html(`You may want to wear a light jacket or sweater.`);

	}else if (data.feel < 25){
		$('.display__info').html(`Most people would consider this to be the perfect temperature.`);
		$('.infoGallery__img').attr("src","./public/assets/whappyperson.svg");
		$('.infoGallery__p').html(`No need for jackets or sweaters.`);

	}else if (data.feel < 32){
		$('.display__info').html(`Fairly hot. Stay hydrated.`);
		$('.infoGallery__img').attr("src","./public/assets/wsweating.svg");
		$('.infoGallery__p').html(`Fatigue is possible with prolonged exposure or moderate physical activity.`);

	}else if (data.feel < 39){
		$('.display__info').html(`Medium risk of death from exposure.  Be sure to drink a lot of water and remain in the shade.`);
		$('.infoGallery__img').attr("src","./public/assets/wexhaustion.svg");
		$('.infoGallery__p').html(`It's very HOT!  Heatstroke and dehydration are likely from exposure and physical activity.`);

	}else if (data.feel > 39){
		$('.display__info').html(`High risk of death from exposure.  VERY VERY HOT!!!   `);
		$('.infoGallery__img').attr("src","./public/assets/wmanfire.svg");
		$('.infoGallery__p').html(`Do not do any physical activity outside.  Drink lots of water and stay out of the sun.`);
	}	
}



air.displayUV = function(data){
	//Hide main document gallery
	$('.document__gallery').addClass('invisible');
	$('.info__gallery').removeClass('invisible');
	$('.info__gallery').css('display', 'flex');
	$('.box').removeClass('black');
	$('#side__uv').addClass('black');
	//main
	$('.display__main').html(`${data.uv} on the UV index`);
	//description
	if(data.uv === 0){
		$('.display__info').html('No sun no worries!');
		$('.infoGallery__img').attr("src","./public/assets/whappyperson.svg");
		$('.infoGallery__p').html(`There is no need for sunscreen or to limit your exposure outside.`);
	}else if(data.uv < 3){
		$('.display__info').html('Low ultra violet index.  ');
		$('.infoGallery__img').attr("src","./public/assets/whappyperson.svg");
		$('.infoGallery__p').html(`No sun protection needed!  Enjoy your time outside!`);
	}else if(data.uv < 5){
		$('.display__info').html('Moderate ultra violet index.  Do not stay in the sun during midday.');
		$('.infoGallery__img').attr("src","./public/assets/what.svg");
		$('.infoGallery__p').html(`Wear a shirt, a hat and some sunscreen (SPF 15+).`);
	}else if(data.uv < 8){
		$('.display__info').html('High ultra violet index.  Avoid the sun especially during midday.  ');
		$('.infoGallery__img').attr("src","./public/assets/wmanfire.svg");
		$('.infoGallery__p').html(`Wearing a shirt, a hat, sunglasses and some sunscreen (SPF 15+) is HIGHLY recommended.`);
	}else if(data.uv < 11){
		$('.display__info').html('Very high ultra violet index.  Avoid the sun if possible.  If you need to go outside wear a shirt, a hat, sunglasses, sunscreen (SPF 15+) and limit exposure to the sun.');
		$('.infoGallery__img').attr("src","./public/assets/wmanonfire.svg");
		$('.infoGallery__p').html(`If you need to go outside wear a shirt, a hat, sunglasses, sunscreen (SPF 15+) and limit exposure to the sun.`);
	}else{
		$('.display__info').html('EXTREME ultraviolet index.  Avoid exposure.  If you must go outside cover exposed skin, constantly re-apply sunscreen and seek shade.');
		$('.infoGallery__img').attr("src","./public/assets/wwildfire.svg");
		$('.infoGallery__p').html(`If you must go outside cover exposed skin, constantly re-apply sunscreen and seek shade.`);
	}

}



air.displayPM25 = function(data){
	//Hide main document gallery
	$('.document__gallery').addClass('invisible');
	$('.info__gallery').removeClass('invisible');
	$('.info__gallery').css('display', 'flex');
	$('.box').removeClass('black');
	$('#side__pm25').addClass('black');
	//Convert AQI to cigarette metric
	var ciggs = Math.floor(data.pm25 / 25);
	if (ciggs === 1){
		$('.infoGallery__p').html(`Breathing this air for 24 hours is equivalent to smoking one cigarette.`);
	}else{
		$('.infoGallery__p').html(`Breathing this air for 24 hours is equivalent to smoking ${ciggs} cigarettes.`);
	}
	//main
	$('.display__main').html(`${data.pm25} PM25.`);


	if(ciggs === 0){
		$('.display__info').html('Air quality is very good.  Go outside and breath deep!');
		$('.infoGallery__img').attr("src","./public/assets/wtree.svg");
	}else if(ciggs === 1){
		$('.display__info').html('Air quality is very good.  Go outside and breath deep!');
		$('.infoGallery__img').attr("src","./public/assets/wsmoker.svg");
	}else if(ciggs === 2){
		$('.display__info').html('Air quality is very good.  Go outside and breath deep!');
		$('.infoGallery__img').attr("src","./public/assets/w2ciggs.svg");
	}else if(ciggs === 3){
		$('.display__info').html('Air quality is very good.  Go outside and breath deep!');
		$('.infoGallery__img').attr("src","./public/assets/w3ciggs.svg");
	}else if(data.pm25<= 100){
		$('.display__info').html('Air quality is moderate.  People with respiratory diseases should limit outdoor exposure.');
		$('.infoGallery__img').attr("src","./public/assets/w3ciggs.svg");
	}else if(data.pm25<= 150){
		$('.display__info').html('Air quality is unhealthy for at risk groups such as infants, the elderly and those with respiratory disease.  Limit outdoor exposure and wear an air filtration mask.');
		$('.infoGallery__img').attr("src","./public/assets/w3ciggs.svg");
	}else if (data.pm25<= 200){
		$('.display__info').html('Air quality is unhealthy.  You should not do physical activity outdoors.  Wear an air filtration mask to limit harmful effects of the poor air quality.');
		$('.infoGallery__img').attr("src","./public/assets/w3ciggs.svg");
	}else if (data.pm25<= 300){
		$('.display__info').html('Air quality is very unhealthy.  Everyone should limit their outdoor exposure.  When going outside be sure to wear an appropriate air filtration mask such as those with an N95 safety rating.');
		$('.infoGallery__img').attr("src","./public/assets/w3ciggs.svg");
	}else if (data.pm25 > 300){
		$('.display__info').html('Air quality is hazardous.  Do not go outside without an N95 filtration mask.');
		$('.infoGallery__img').attr("src","./public/assets/w3ciggs.svg");
	}
}



//Initialize page
air.init = function(){
	air.getCity();
};

$(function(){
	air.init();
});





//pseudo code

//On the first page ask for user input from section input.
//when user puts in input remove section

//show splash page
//temperature name etc
//if user clicks sidebar replace main page with info
//inside new main page show relevant info based on current conditions



