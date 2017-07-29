import Unsplash, { toJson } from 'unsplash-js';

const unsplash = new Unsplash({
	applicationId: 'f3a562a5af73aeba7b26055ab87f226b06b83a8d47cd93c63ea5dea131b09ec8',
	secret: '6b687268c997f100ac1a0b74333f86185f271e53c0272fba78737d68c8e438fd',
	callbackUrl: 'urn:ietf:wg:oauth:2.0:oob'
});

function debounce(f, ms){
	let state = null;
	const FROZEN = 1;

	return function(){
		if(state) return;

		f.apply(this, arguments);
		state = FROZEN;
		setTimeout(function(){state = null}, ms);
	}
}

$(document).ready(function() {
	const hand = $('.hand-left'),
		finger = $('.finger'),
		slider = $('.slider'),
		handRight = $('.hand-right'),
		FINGER_RATIO_X = 2.95,
		FINGER_RATIO_Y = 3.351,
		SLIDER_RATIO_X = 11.793,
		SLIDER_RATIO_Y = 10.687,
		HAND_RIGHT_RATIO_X = -7.29,
		HAND_RIGHT_RATIO_Y = 5.96;

	setPositionAll();

	window.addEventListener('resize', setPositionAll);
	document.addEventListener('wheel', debounce(onScroll, 2000));
	document.addEventListener('touchmove', debounce(onScroll, 2000));

	function setPositionAll() {
		setPosition(finger, FINGER_RATIO_X, FINGER_RATIO_Y);
		setPosition(slider, SLIDER_RATIO_X, SLIDER_RATIO_Y);
		setPosition(handRight, HAND_RIGHT_RATIO_X, HAND_RIGHT_RATIO_Y);
	}

	function onScroll() {
		slideNextPicture();
		setNextBullet();
		triggerHandRight();
	}

	function setPosition(elem, ratioX, ratioY) {
		elem.css({
			top: hand.height() / ratioY + 'px',
			right: hand.width() / ratioX + 'px',
			opacity: elem == handRight ? 0 : 1
		});
	}

	function slideNextPicture() {
		let picId;
		const source = 'https://source.unsplash.com/',
			size = '/270x480',
			firstPicture = slider.children(':first-child'),
			secondPicture = slider.children(':last-child');

		if (firstPicture.hasClass('slider-pic--active')) {
			//пока глазеем на новую картинку, подгружается вторая
			changePicture(firstPicture, secondPicture);
		} else {
			changePicture(secondPicture, firstPicture);
		}

		function changePicture(pic1, pic2) {
			unsplash.photos.getRandomPhoto().then(toJson).then(json => {
				picId = json.id;
			pic1.attr('src', source + picId + size);
              console.log(source + picId + size);
		});
			pic1.removeClass('slider-pic--active');
			pic2.addClass('slider-pic--active');
		}
	}

	function triggerHandRight() {
		handRight.addClass('hand-right--motion');
		setTimeout(function() {
			handRight.removeClass('hand-right--motion');
		}, 2000); //время выполнения анимации
	}

	function addClassToBullet(bullet) {
		return bullet
			.addClass('bullet--active')
			.siblings()
			.removeClass('bullet--active');
	}

	function setNextBullet() {
		const bul = $('.bullet--active');
		if (bul.next().length > 0) {
			return addClassToBullet(bul.next());
		}
		return addClassToBullet(bul.siblings(':first-child'));
	}
});