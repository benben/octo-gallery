$.domReady(function () {
  $('body')
    .append('<div id="octo_gallery_overlay"></div>')
    .append('<div id="octo_gallery_image_container"><img id="octo_gallery_image" src="" alt=""><div id="octo_gallery_close"></div><div id="octo_gallery_counter"></div><p id="octo_gallery_alt"></p></div>')

  $(window)
    .bind('resize', function (e) {
      set_image_dimensions()
    })

  $(document)
    .bind('keydown', function (e) {
      if ($('#octo_gallery_overlay').css('display') !== 'none') {
        // ESC
        if (e.keyCode === 27) {
          e.preventDefault()
          octo_close()
        } else
        // arrow left
        if (e.keyCode === 37) {
          octo_navigate('down')
        } else
        // arrow right
        if (e.keyCode === 39) {
          octo_navigate('up')
        }
      }
    })

  $('a.octo_gallery')
    .bind('click', function (e) {
      e.preventDefault()
      octo_open($(this))
      $('#octo_gallery_image_container').css('display', 'block')
      $('#octo_gallery_overlay').css('display', 'block')
    })

  $('#octo_gallery_close')
    .bind('click', function (e) {
      octo_close()
    })

  $('#octo_gallery_overlay')
    .bind('click', function (e) {
      octo_close()
    })

  $('#octo_gallery_image')
    .bind('click', function (e) {
      octo_navigate('up')
    })

  function set_image_dimensions() {
    var body_w     = $('body').width()
    var body_h     = $('body').height()
    var original_w = $('#octo_gallery_image').attr('data-width')
    var original_h = $('#octo_gallery_image').attr('data-height')
    var current_w  = $('#octo_gallery_image_container').width()
    var current_h  = $('#octo_gallery_image_container').height()

    var calculated_w = body_w - parseInt($('#octo_gallery_image').css('margin'))*2

    if(body_w >= current_w) {
      if (current_w < original_w) {
        $('#octo_gallery_image').css('width', calculated_w)
      }
      $('#octo_gallery_image_container').css('left', (body_w - current_w) / 2)
    } else {
      $('#octo_gallery_image_container').css('left', 0)
      $('#octo_gallery_image').css('width', calculated_w)
    }
    $('#octo_gallery_image_container').css('top', $('body').scrollTop()+'px')
    $('#octo_gallery_counter').css('top', (parseInt($('#octo_gallery_image').css('height')) - parseInt($('#octo_gallery_counter').css('height')))+'px')
  }

  function octo_open(node) {
    $('#octo_gallery_image').attr('rel', node.attr('rel'))
    $('#octo_gallery_image').attr('src', node.attr('href')).load(function() {
      node.attr('data-width',  node.width())
      node.attr('data-height', node.height())
      set_image_dimensions()
    })
    $('#octo_gallery_counter').text(get_position(node) + "/" + (node.siblings('a[rel~="'+$('a.octo_gallery').attr('rel')+'"]').length+1))
    $('#octo_gallery_alt').text(node.children('img').attr('alt'))
  }

  function octo_close() {
    $('#octo_gallery_overlay').css('display', 'none')
    $('#octo_gallery_image_container').css('display', 'none')
  }

  function octo_navigate(direction) {
    var current_gallery = $('#octo_gallery_image').attr('rel')
    var current_src     = $('#octo_gallery_image').attr('src')
    var current_images  = $('a.octo_gallery[rel~="'+current_gallery+'"]')
    var current_image   = $('a.octo_gallery[rel~="'+current_gallery+'"][href="'+current_src+'"]')
    if (direction === 'down') {
      if (current_image.previous().length !== 0) {
        octo_open(current_image.previous())
      } else {
        octo_open(current_images.last())
      }
    } else
    if (direction === 'up') {
      if (current_image.next().length !== 0) {
        octo_open(current_image.next())
      } else {
        octo_open(current_images.first())
      }
    }
  }

  function get_position(node) {
    var title = node.attr('rel')
    var elements = $('a.octo_gallery[rel~="'+title+'"]')
    var current
    elements.each(function(el, index){
      if ($(el).attr('href') == node.attr('href')) {
        current = index
      }
    })
    return current+1
  }
})
