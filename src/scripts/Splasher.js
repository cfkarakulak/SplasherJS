/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

import Defaults from './Helpers/Defaults';
import Events from './Events/Events';

export default class Splasher {
  constructor(options) {
    this.settings = $.extend({}, Defaults, options);

    const events = new Events();

    events.add({
      element: this.settings.selector,
      event: 'click',
      handler: this.reveal,
    });

    events.add({
      element: '.modal a[data-rel="close"]',
      event: 'click',
      handler: this.act,
    });

    events.add({
      event: 'click',
      handler: this.act,
    });

    events.add({
      event: 'keyup',
      handler: this.act,
    });
  }

  reveal() {
    const data = Splasher.explode($(this).data('splash'));
    const $modal = $(`.modal[data-identify="${data.name}"]`);

    if ($modal.length <= 0) {
      return false;
    }

    if (data.wait) {
      return false;
    }

    $('body')
      .addClass('no-scroll')
      .find($modal.get(0))
      .addClass('active');

    if (data.attr.class) {
      $($modal.get(0))
        .addClass(data.attr.class)
        .data('class', data.attr.class);
    }

    return false;
  }

  act(event) {
    const $modal = $('.modal');
    const $target = $(event.target);

    if (!$modal.hasClass('active')) {
      return true;
    }

    if (event.type === 'keyup') {
      if (event.keyCode === 27) {
        return Splasher.conceal($modal);
      }

      return true;
    }

    if ($target.closest('.modal__wrapper').length <= 0 || $target.is('[data-rel="close"]')) {
      return Splasher.conceal($modal);
    }

    return undefined;
  }

  static conceal($modal) {
    $('body')
      .removeClass('no-scroll reveal')
      .find($modal.get(0))
      .addClass('passive');

    setTimeout(() => {
      $modal
        .removeClass('active passive')
        .removeClass($modal.data('class'));
    }, 80);

    return false;
  }

  static explode(config) {
    const name = config.includes('name:') ? config.match(/name:\((.*?)\)/)[1] : false;
    const esc = config.includes('esc:') ? String(config.match(/esc:\((.*?)\)/)[1]) === 'true' : false;
    const blur = config.includes('blur:') ? String(config.match(/blur:\((.*?)\)/)[1]) === 'true' : false;
    const wait = config.includes('wait:') ? String(config.match(/wait:\((.*?)\)/)[1]) === 'true' : false;
    const attr = config.includes('attr:') ? String(config.match(/attr:\((.*?)\)/)[1]) : null;
    let xlass;

    if (attr) {
      xlass = attr.includes('class{') ? String(attr.match(/class{(.*?)}/)[1]) : false;
    }

    return {
      name,
      esc,
      blur,
      wait,
      attr: {
        class: xlass,
      },
    };
  }

  static reveal(config, modal) {
    const data = Splasher.explode(config);
    const $modal = $(`.modal[data-identify="${modal}"]`);

    if ($modal.length <= 0) {
      return false;
    }

    if (data.wait) {
      return false;
    }

    $('body')
      .addClass('no-scroll')
      .find($modal.get(0))
      .addClass('active');

    if (data.attr.class) {
      $($modal.get(0))
        .addClass(data.attr.class)
        .data('class', data.attr.class);
    }

    return false;
  }
}
