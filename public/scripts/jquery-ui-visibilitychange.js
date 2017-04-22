/*global jQuery:false */
(function($, window, document, undefined) {
  var coreCounter = 1;
  $.widget('ui.core', {
    _observer: null,
    _observerInit: {
          childList: false,
          attributes: true,
          characterData: false,
          subtree: false,
          attributeOldValue: true,
          characterDataOldValue: false,
          attributeFiter: ['display']
    },
    _getTopElement: function() {
      return this.element.closest('.ui-core');
    },

    _observerCallback: function(mutations) {
      var _self = this;
      mutations.forEach(function(mutation) {
        _self._trigger(mutation.type, null, mutation);
      });
    },

    options: {},
    _create: function() {
      this.element.wrap(
        $('<div>')
          .addClass('ui-core')
          .addClass('ui-core-' + (coreCounter++))
      );
      this._observer = new window.MutationObserver(
        this._observerCallback.bind(this)
      );
      this._observer.observe(
        this._getTopElement()[0],
        this._observerInit
      );
    },

    _destroy: function() {
      this._observer.disconnect();
      this._observer = null;
    }
  }); // end ui.core
  $.widget('ui.randomcolor', $.ui.core, {
    options: {
    },

    _observerCallback: function(mutations) {
      var _self = this;
      mutations.forEach(function(mutation) {
        _self._trigger(mutation.type, null, mutation);
      });
    },

    _isShown: function(event, mutationRecord) {
      var _self = this;
      if (mutationRecord.attributeName === 'style') {
        if (mutationRecord.oldValue && mutationRecord.oldValue.indexOf('display: none') >= 0 && $(event.target).is(':visible')) {
          if (event.currentTarget === mutationRecord.target) {
            // 自分自身が非表示から表示状態になったことを示す
            // shownイベントをトリガー
            _self._trigger('shown', event, {});
          }
        }
      }
    },

    _onShown: function(event, data) {
      this._changeColor();
    },

    _changeColor: function() {
      var r = Math.floor(Math.random() * 255),
          g = Math.floor(Math.random() * 255),
          b = Math.floor(Math.random() * 255);
      this.element.css('color',
                       'rgba(' + r + ', ' + g + ', ' + b + ', 1)'
                      );
    },

    _create: function() {
      var _self = this;
      this._super();
      this._getTopElement()
        .on('randomcolorattributes', this._isShown.bind(this))
        .on('randomcolorshown', this._onShown.bind(this));
    }
  });

  $(document).ready(function() {
    $('.field').randomcolor();
    $('.ui-core .ui-core').hide();
  });
})(jQuery, window, document);
