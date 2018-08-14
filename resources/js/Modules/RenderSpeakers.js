import $ from 'jquery';
import { Popup } from '../Components/Popup';
import { Helpers } from '../Helpers';

window.jQuery = $;
require('../vendors/jquery-tmpl/jquery.tmpl.min');

const speakers = [
  {
    image : 'public/img/speakers/vitaliy_kucheryaviy.jpg',
    name : 'Vitaliy Kucheryaviy',
    position : 'Fullstack Developer',
    company : '',
    rept : [
      {
        title : '',
        description : ''
      }
    ],
    aboutSpeaker : '',
    socialsRendered : '',
    socials : []
  },
  {
    image : 'public/img/speakers/igor_davydenko.jpg',
    name : 'Igor Davydenko',
    position : 'Python/JS Developer',
    company : '',
    rept : [
      {
        title : '',
        description : ''
      }
    ],
    aboutSpeaker : '',
    socialsRendered : '',
    socials : []
  }
];


export class RenderSpeakers {
  constructor() {
    this.popup = new Popup('#speakers-modal');
    this._init();
    this._events();
    this.helpers = new Helpers();
  }

  _init() {
    if( localStorage.speakersModalHtml && location.hash.search(/speakers-modal/) ) {
      $('#speakers-modal').html( localStorage.speakersModalHtml )
    }

    let speakerItem =
      '<div class="speaker-item" data-remodal-target="speakers-modal" data-item-index="__ReplaceWithIndex">' +
      '<div class="speaker-img">' +
      '<img src="${image}" alt="${name}">' +
      '</div>' +
      '<div class="speaker-name">${name}</div>' +
      '<div class="speaker-position">${position} ' +
      '{{if company}}' +
      '@${company}' +
      '{{/if}}' +
      '</div>' +
      '<div class="speaker-report">' +
      '{{each rept }} {{html $value.title}} </br> </br>{{/each}}' +
      '</div>' +
      '</div>';

    $.template('speakerTemplate', speakerItem);

    let spekersHtml = '';

    $.each(speakers, function (i, sp) {
      let item = $.tmpl('speakerTemplate', sp)[0].outerHTML;

      spekersHtml += item.replace('__ReplaceWithIndex', i);

    });

    $('#speakers-list').html(spekersHtml);

  }

  _events() {
    let that = this;
    $(document).on('click', '[data-remodal-target="speakers-modal"]', function () {
      let $speakerInfoBlock = $(this);
      loadSpeakerModal($speakerInfoBlock);
    });

    function loadSpeakerModal($speakerInfoBlock) {
      let $modalBody = $('#speakers-modal'),
        $modalSpeakerAvatar = $modalBody.find('.speakers-modal_img img'),
        $modalNameElement = $modalBody.find('.speaker-name'),
        $modalSpeakerPosition = $modalBody.find('.speaker-position .position'),
        $modalSpeakerCompany = $modalBody.find('.speaker-position .company'),
        $modalreportsContainer = $modalBody.find('.speakers-modal_content'),
      // $modalSpeakerLinks = $modalBody.find('.speaker__link-list'),
      // $modalSpeakerAboutText = $modalBody.find('.speaker-text').toggle(false);

      speakerIndex = parseInt($speakerInfoBlock.attr('data-item-index')),

        $prevButton = $modalBody.find('button.remodal-prev'),
        $nextButton = $modalBody.find('button.remodal-next');

      $prevButton.unbind('click').click(() => {
        let prevIndex = speakerIndex == 0 ? (speakers.length - 1) : speakerIndex - 1;
        that.helpers.showLoader($modalBody);

        setTimeout(function () {
          loadSpeakerModal($('[data-item-index="' + prevIndex + '"]'));
        }, 600);
      });

      $nextButton.unbind('click').click(() => {
        let nextIndex = speakerIndex == speakers.length - 1 ? 0 : speakerIndex + 1;
        that.helpers.showLoader($modalBody);

        setTimeout(function () {
          loadSpeakerModal($('[data-item-index="' + nextIndex + '"]'));
        }, 600);

      });

      let speakerData = speakers[speakerIndex];

      if(speakerData) {
        let speakerAvatar = speakerData.image,
          speakerName = speakerData.name,
          speakerPosition = speakerData.position,
          speakerCompany = speakerData.company,
          reports = speakerData.rept,
          reportsContent = '',
          speakerAboutText = speakerData.aboutSpeaker;

        reports.forEach(function (item, i, arr) {
          reportsContent += `
            <div class="speaker-report">${item.title}</div>
            <div>${item.description}</div>
          `;
        });

        speakerAvatar && $modalSpeakerAvatar.attr('src', speakerAvatar);
        speakerName && $modalNameElement.text(speakerName);
        speakerPosition && $modalSpeakerPosition.text(speakerPosition);
        speakerCompany && $modalSpeakerCompany.text(`@${speakerCompany}`);

        reportsContent && $modalreportsContainer.html(reportsContent);

        // speakerAboutText && $modalSpeakerAboutText.find('.modal-body__text').text(speakerAboutText).end().toggle(true);
        // $modalSpeakerLinks.html($speakerInfoBlock.find('.speakers-slide__info-links').html());

        that.helpers.hideLoader($modalBody);
        localStorage.setItem( 'speakersModalHtml', $modalBody.html() );
      }
    }
  }
}