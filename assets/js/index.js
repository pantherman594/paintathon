let cookies;

$('.vote-item').each((i, item) => {
  $(item).on('click', (e) => {
    $('#image-fullview').attr('src', e.target.dataset.img);

    $('#vote-button').off('click');
    $('#vote-button').on('click', (ev) => {
      console.log('voted for ');
      console.log(e.target);
      setCookie('voted', i);
      if (document.getElementsByClassName('voted')[0] === e.target) return;
      $('.vote-item').each((i, item) => {
        if ($(item).hasClass('voted')) {
          if (item !== e.target) {
            console.log('removed vote for ');
            console.log(item);
            $(item).removeClass('voted');
          } else {
            return;
          }
        }
        $(item).addClass('not-voted');
      });
      $(e.target).addClass('voted');
    });

    $('#image-view').fadeIn();
  });
});

$('#image-view').on('click', () => {
  $('#image-view').fadeOut();
});

$('body').on('keyup', (e) => {
  if (e.which === 27) {
    $('#image-view').fadeOut();
  }
});

setCookie = (name, value) => {
  cookies[name] = value;
  document.cookie = `${name}=${value};path=/`;
};

$(document).ready(() => {
  $('.vote-item').each((i, item) => {
    $(item).css('background-image', `url(${item.dataset.img})`);
  });

  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  cookies = {};

  for(var i = 0; i < ca.length; i++) {
    let c = ca[i];
    while(c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    const cData = c.split('=');
    cookies[cData[0]] = cData[1];
  }

  if ('voted' in cookies) {
    let voted = cookies['voted'];
    $('.vote-item').each((i, item) => {
      if (i.toString() === voted) {
        $(item).addClass('voted');
      } else {
        $(item).addClass('not-voted');
      }
    });
  }
});
