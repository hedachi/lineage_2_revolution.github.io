// Generated by CoffeeScript 1.12.7
var AbstractSimulator, Controller, PopupWindow, SavedToggleButton, TargetSimulator, with_scroll,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AbstractSimulator = (function() {
  function AbstractSimulator(plus, simulation_number, try_times) {
    this.plus = plus;
    this.simulation_number = simulation_number;
    this.try_times = try_times;
  }

  AbstractSimulator.prototype.show_result = function(result) {};

  AbstractSimulator.prototype.show_message = function(message) {
    return $('.result_area').append("<div>" + message + "</div>");
  };

  AbstractSimulator.get_data = function(plus) {
    var data;
    data = this.DATA[plus];
    return {
      percent: data[0],
      money: data[1],
      scroll: data[2],
      marble: data[3]
    };
  };

  AbstractSimulator.DATA = [[100, 3400, 1, 0], [100, 3400, 1, 0], [100, 3400, 1, 0], [90, 3400, 1, 1], [80, 3400, 1, 1], [70, 16700, 2, 2], [60, 16700, 2, 2], [50, 16700, 2, 3], [45, 16700, 2, 3], [45, 16700, 2, 4], [45, 33400, 3, 4], [45, 33400, 3, 5], [45, 33400, 3, 5], [40, 33400, 3, 6], [40, 33400, 3, 6], [40, 33400, 4, 7], [40, 66700, 4, 7], [40, 66700, 4, 8], [35, 66700, 4, 8], [35, 66700, 4, 9], [35, 66700, 5, 9], [35, 66700, 5, 10], [35, 66700, 5, 10], [30, 66700, 5, 11], [30, 66700, 5, 11], [30, 66700, 6, 12], [30, 100000, 6, 12], [30, 100000, 6, 13], [25, 100000, 6, 13], [25, 100000, 6, 14]];

  return AbstractSimulator;

})();

TargetSimulator = (function(superClass) {
  extend(TargetSimulator, superClass);

  function TargetSimulator() {
    return TargetSimulator.__super__.constructor.apply(this, arguments);
  }

  TargetSimulator.execute_count = 0;

  TargetSimulator.EXECUTE_COUNT_LIMIT = 0;

  TargetSimulator.prototype.exec = function(target_plus) {
    var before_plus, data, is_success;
    if (TargetSimulator.execute_count > TargetSimulator.EXECUTE_COUNT_LIMIT) {
      return false;
    }
    this.used_scroll_num = 0;
    this.used_money = 0;
    this.result_process = [new Number(this.plus)];
    while (true) {
      TargetSimulator.execute_count++;
      if (target_plus > this.plus) {
        data = this.constructor.get_data(this.plus);
        this.used_scroll_num += data.scroll;
        this.used_money += data.money;
        before_plus = this.plus;
        is_success = (data.percent / 100) >= Math.random();
        if (is_success) {
          this.plus++;
        } else if (this.plus === 30 || this.plus % 10 !== 0) {
          this.plus--;
        }
        this.result_process.push(new Number(this.plus));
      } else {
        this.show_result();
        break;
      }
    }
    return true;
  };

  TargetSimulator.prototype.show_result = function() {
    var $result_tr, text;
    $result_tr = $('<tr></tr>');
    $result_tr.append($("<td>" + this.simulation_number + "</td>"));
    $result_tr.append($("<td class='enhance_times'>" + (this.result_process.length - 1) + "</td>"));
    $result_tr.append($("<td class='used_scroll_num'>" + this.used_scroll_num + "</td>"));
    $result_tr.append($("<td class='used_money'>" + this.used_money + "</td>"));
    $result_tr.append($("<td class='used_money_not_weapon'>" + (Math.round(this.used_money / 4)) + "</td>"));
    if (Controller.show_details()) {
      text = this.result_process.map(function(plus) {
        return " +" + plus + " ";
      }).join('→');
      $result_tr.append($("<td><input class='show_details' type='button' value='詳細' data-details='" + text + "'/></td>"));
    }
    return $('table#result').append($result_tr);
  };

  return TargetSimulator;

})(AbstractSimulator);

with_scroll = false;

Controller = (function() {
  function Controller() {}

  Controller.get_sum = function(selector) {
    var sum;
    sum = 0;
    $(selector).each(function(index, element) {
      return sum += parseInt(element.innerHTML);
    });
    return sum;
  };

  Controller.get_average = function(selector) {
    var average;
    average = this.get_sum(selector) / $(selector).size();
    return Math.round(average * 10) / 10;
  };

  Controller.initialize = function() {
    $('span.result_plus').text($('#plus').val());
    $('span.result_plus_target').text($('#plus_target').val());
    $('span.result_execute_times').text(parseInt($('#simulation_type').val()));
    TargetSimulator.EXECUTE_COUNT_LIMIT = parseInt($('#execute_count').val());
    return $('table#result tr').not('#result_area_header').detach();
  };

  Controller.finalize = function() {
    var used_money_average;
    $('#average_enhance_times').text(this.get_average('.enhance_times').toFixed(1));
    $('#average_used_scroll_num').text(this.get_average('.used_scroll_num').toFixed(1));
    used_money_average = this.get_average('.used_money');
    $('#average_used_money').text((used_money_average / 10000).toFixed(1));
    $('#average_used_money_not_weapon').text((used_money_average / 4 / 10000).toFixed(1));
    return TargetSimulator.execute_count = 0;
  };

  Controller.execute = function() {
    var i, is_continuable, j, ref, sim, try_times;
    this.initialize();
    try_times = parseInt($('#simulation_type').val());
    $('th#result_details').toggle(this.show_details());
    for (i = j = 1, ref = try_times; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
      sim = new TargetSimulator($('#plus').val(), i, try_times);
      is_continuable = sim.exec(parseInt($('#plus_target').val()));
      if (!is_continuable) {
        break;
      }
    }
    return this.finalize();
  };

  Controller.show_details = function() {
    return false;
  };

  return Controller;

})();

PopupWindow = (function() {
  function PopupWindow() {}

  PopupWindow.show = function() {
    return $('#popup_window_base').show();
  };

  PopupWindow.hide = function() {
    return $('#popup_window_base').hide();
  };

  PopupWindow.set_title = function(title) {
    return $('.popup_window_title').html(title);
  };

  PopupWindow.set_content = function(content) {
    return $('.popup_window_content').html(content);
  };

  PopupWindow.init = function() {
    $('#explain').click((function(_this) {
      return function() {
        _this.set_title('このデータは何？');
        _this.set_content;
        return _this.show();
      };
    })(this));
    return $('#close_popup_window').click(function() {
      return PopupWindow.hide();
    });
  };

  return PopupWindow;

})();

SavedToggleButton = (function() {
  function SavedToggleButton() {}

  SavedToggleButton.set = function(button_selector, target_selector) {
    this.reflect_local_storage(button_selector, target_selector);
    return $(button_selector).click((function(_this) {
      return function() {
        _this.toggle_local_storage(button_selector, target_selector);
        return _this.reflect_local_storage(button_selector, target_selector);
      };
    })(this));
  };

  SavedToggleButton.get_key = function(button_selector, target_selector) {
    return button_selector + "___" + target_selector;
  };

  SavedToggleButton.toggle_local_storage = function(button_selector, target_selector) {
    var is_visible, key;
    key = this.get_key(button_selector, target_selector);
    is_visible = localStorage.getItem(key);
    if (is_visible) {
      return localStorage.removeItem(key);
    } else {
      return localStorage.setItem(key, '1');
    }
  };

  SavedToggleButton.reflect_local_storage = function(button_selector, target_selector) {
    var is_visible, key;
    key = this.get_key(button_selector, target_selector);
    is_visible = localStorage.getItem(key);
    if (is_visible) {
      return $(target_selector).hide();
    } else {
      return $(target_selector).show();
    }
  };

  return SavedToggleButton;

})();

$(function() {
  var i, j, k;
  for (i = j = 0; j <= 29; i = ++j) {
    $('#plus').append("<option value='" + i + "'>" + i + "</option>");
  }
  for (i = k = 1; k <= 30; i = ++k) {
    $('#plus_target').append("<option value='" + i + "'>" + i + "</option>");
  }
  $('#plus').val(5 + Math.floor(Math.random() * 5));
  $('#plus_target').val(parseInt($('#plus').val()) + 1);
  $('#run').click(function() {
    return Controller.execute();
  });
  $('#toggle_details').click(function() {
    return $('table#result').toggle();
  });
  $('#plus').change(function() {
    $('#plus_target').val(parseInt($('#plus').val()) + 1);
    return Controller.execute();
  });
  $('#plus_target').change(function() {
    return Controller.execute();
  });
  $('#simulation_type').change(function() {
    return Controller.execute();
  });
  SavedToggleButton.set('#toggle_settings', '.settings');
  Controller.execute();
  return PopupWindow.init();
});
