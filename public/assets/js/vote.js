let cookies;
let votes = {};

const updateVotes = (votes) => {
  votes = votes;
  let sum = 0;
  Object.keys(votes).forEach((key) => {
    sum += votes[key];
  });

  let extension = '.png';
  console.log(document.getElementById('show_overlaid').checked)
  if (document.getElementById('show_overlaid').checked === true) {
    extension = '.overlaid.png';
  }
  const vGrid = $('#vote-grid');
  vGrid.empty();
  Object.keys(votes).forEach((key) => {
    let childVotes = votes[key];
    let percentage = Math.round(childVotes * 100 / sum);
    vGrid.append(`<div class="vote-item" data-img="/img/${key}${extension}" data-id="${key}"><span>${childVotes} (${percentage}%)</span></div>`);
  });

  $('.vote-item').each((i, item) => {
    $(item).css('background-image', `url(${item.dataset.img})`);
  });

  $('.vote-item').on('click', (e) => {
    $('#image-fullview').attr('src', e.target.dataset.img);
    const id = e.target.dataset.id;

    $('#vote-button').off('click');
    $('#vote-button').on('click', (ev) => {
      console.log('voted for ');
      console.log(e.target);
      let removes = [];

      setCookie('voted', id);
      if (document.getElementsByClassName('voted')[0] === e.target) return;

      $('.vote-item').each((i, item) => {
        if ($(item).hasClass('voted')) {
          if (item !== e.target) {
            removes.push(item.dataset.id);

            console.log('removed vote for ');
            console.log(item);
            $(item).removeClass('voted');
          } else {
            return;
          }
        }
        $(item).addClass('not-voted');
      });
      $.post('/update', { add: id, remove: removes }, (data) => {
        console.log('a');
        console.log(data);
        updateVotes(data);
      }, 'JSON');
    });

    $('#image-view').fadeIn();
  });


  if ('voted' in cookies) {
    let voted = cookies['voted'];
    console.log("VOTED");
    console.log(voted);
    $('.vote-item').each((i, item) => {
      if (item.dataset.id === voted) {
        $(item).addClass('voted');
      } else {
        $(item).addClass('not-voted');
      }
    });
  }
};

$('#show_overlaid').on('change', () => {
  $.get('/votes', (data) => {
    updateVotes(data);
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

  $.get('/votes', (data) => {
    console.log('b');
    console.log(data);
    updateVotes(data);
  });
});
