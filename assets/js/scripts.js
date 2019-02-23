/*
* Zoom Images, Get Date and Shadow
* ========================================================================== */

(function() {
  /* variables */
  var shadow = document.getElementById('shadow');
  var images = document.querySelectorAll('a img');
  var imageHeight = window.innerHeight - 20;

  /* events */
  shadow.addEventListener('click', resetShadow, false);
  window.addEventListener('keydown', resetStyles, false);
  window.addEventListener('resize', refreshImageSizes, false);

  /* functions */
  setDate();
  toggleImages();


  function setDate() {
    var currentYear = document.querySelector('.full-year');
    if (currentYear) {
      currentYear.innerHTML = new Date().getFullYear();
    }
  }

  function refreshImageSizes() {
    // select all images
    [].forEach.call(images, function(img) {
      // if image zoomed
      if (img.classList.contains('img-popup')) {
        img.style.maxHeight = imageHeight + 'px';
        img.style.marginLeft = '-' + (img.offsetWidth / 2) + 'px';
        img.style.marginTop = '-' + (img.offsetHeight / 2) + 'px';
      }
    });
  }

  function resetShadow() {
    shadow.style.display = 'none';
    resetAllImages();
  }

  function resetStyles(event) {
    if (event.keyCode == 27) {
      event.preventDefault();
      shadow.style.display = 'none';
      resetAllImages();
    }
  }

  function resetAllImages() {
    [].forEach.call(images, function(img) {
      img.classList.remove('img-popup');
      img.style.cursor = 'zoom-in';
      img.style.marginLeft = 'auto';
      img.style.marginTop = 'auto';
    });
  }

  function toggleImages() {
    [].forEach.call(images, function(img) {
      img.addEventListener('click', function(event) {
        event.preventDefault();
        img.classList.toggle('img-popup');
        if (img.classList.contains('img-popup')) {
          img.style.cursor = 'zoom-out';
          img.style.maxHeight = imageHeight + 'px';
          img.style.marginLeft = '-' + (img.offsetWidth / 2) + 'px';
          img.style.marginTop = '-' + (img.offsetHeight / 2) + 'px';
          shadow.style.display = 'block';
        } else {
          img.style.cursor = 'zoom-in';
          img.style.maxHeight = '100%';
          img.style.marginLeft = 'auto';
          img.style.marginTop = 'auto';
          shadow.style.display = 'none';
        }
      });
    });
  }
})();


/*
* Aside Resize
* ========================================================================== */

(function() {
  var aside = document.querySelector('.sidebar');
  var mainContainer = document.querySelectorAll('.content-wrapper');
  var switcher = document.getElementById('switcher');

  switcher.addEventListener('click', slide, false);

  function slide() {
    aside.classList.add('transition-divs');
    aside.classList.toggle('aside-left');
    [].forEach.call(mainContainer, function(c) {
      c.classList.add('transition-divs');
      c.classList.toggle('centering');
    });
  }
})();

/**
 * Use Barba.js PJAX.
 */
(function() {

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading])
        .then(this.switch.bind(this));
    },
  
    switch: function() {

      // update cover background
      var $newContainer = $(this.newContainer);
      var $oldContainer = $(this.oldContainer);
      var oldCoverBg = $oldContainer.find('.cover-image-on').css('background-image');
      var newCoverBg = $newContainer.find('.cover-image-on').css('background-image');
      $oldContainer.find('.cover-image:not(.cover-image-on)').css('background-image', newCoverBg);
      $oldContainer.find('.cover-image:not(.cover-image-on)').addClass('cover-image-switch');
      $oldContainer.find('.cover-image-switch').imagesLoaded(
        {background: true},
        function() {
          $(".cover-image-on").removeClass("cover-image-on");
          $(".cover-image-switch").addClass("cover-image-on");
          $(".cover-image-switch").removeClass("cover-image-switch");
        }
      )

      // update cover text
      this.updateHtml.bind(this)('.cover-text');

      // update content
      this.updateHtml.bind(this)('main');

      // scroll to top
      $("html, body").animate({ scrollTop: 0 }, 0);

      // swap oldContainer and newContainer, since oldContainer has been updated, and newContainer is no longer needed.
      this.swapContainer.bind(this)();

      // done
      this.done();
    },

    updateHtml: function(selector) {
      var $oldWrapper = $(this.oldContainer).find(selector);
      var $newWrapper = $(this.newContainer).find(selector);
      $oldWrapper.html($newWrapper.html());
    },

    swapContainer: function() {
      var _new = this.newContainer;
      this.newContainer = this.oldContainer;
      this.oldContainer = _new;
    }
  });

  
  
  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };
  Barba.Pjax.start();
})();

