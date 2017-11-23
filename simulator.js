// Generated by CoffeeScript 1.12.7
(function() {
  var Controller, PopupWindow, SavedToggleButton, Simulator, with_scroll;

  Simulator = (function() {
    function Simulator(plus, simulation_number, try_times, marble_count) {
      this.plus = plus;
      this.simulation_number = simulation_number;
      this.try_times = try_times;
      this.marble_count = marble_count;
      this.results = [];
    }

    Simulator.prototype.show_result = function(result) {};

    Simulator.prototype.show_message = function(message) {
      return $('.result_area').append("<div>" + message + "</div>");
    };

    Simulator.get_data = function(plus) {
      var data;
      data = this.DATA[plus];
      return {
        percent: data[0],
        money: data[1],
        scroll: data[2],
        marble: data[3]
      };
    };

    Simulator.DATA = [[100, 3400, 1, 0], [100, 3400, 1, 0], [100, 3400, 1, 0], [90, 3400, 1, 1], [80, 3400, 1, 1], [70, 16700, 2, 2], [60, 16700, 2, 2], [50, 16700, 2, 3], [45, 16700, 2, 3], [45, 16700, 2, 4], [45, 33400, 3, 4], [45, 33400, 3, 5], [45, 33400, 3, 5], [40, 33400, 3, 6], [40, 33400, 3, 6], [40, 33400, 4, 7], [40, 66700, 4, 7], [40, 66700, 4, 8], [35, 66700, 4, 8], [35, 66700, 4, 9], [35, 66700, 5, 9], [35, 66700, 5, 10], [35, 66700, 5, 10], [30, 66700, 5, 11], [30, 66700, 5, 11], [30, 66700, 6, 12], [30, 100000, 6, 12], [30, 100000, 6, 13], [25, 100000, 6, 13], [25, 100000, 6, 14]];

    Simulator.execute_count = 0;

    Simulator.EXECUTE_COUNT_LIMIT = 0;

    Simulator.prototype.exec = function(target_plus) {
      var before_plus, data, is_success, with_marble;
      if (Simulator.execute_count > Simulator.EXECUTE_COUNT_LIMIT) {
        return [this.results, false];
      }
      this.used_scroll_num = 0;
      this.used_money = 0;
      this.result_process = [];
      this.result_process.push({
        plus: new Number(this.plus),
        is_success: null
      });
      while (true) {
        Simulator.execute_count++;
        if (target_plus > this.plus) {
          data = this.constructor.get_data(this.plus);
          this.used_scroll_num += data.scroll;
          this.used_money += data.money;
          before_plus = this.plus;
          is_success = (data.percent / 100) >= Math.random();
          with_marble = this.marble_count >= data.marble;
          if (with_marble) {
            this.marble_count = this.marble_count - data.marble;
          }
          if (is_success) {
            this.plus++;
          } else if (with_marble) {

          } else if (this.plus === 30 || this.plus % 10 !== 0) {
            this.plus--;
          }
          this.result_process.push({
            plus: new Number(this.plus),
            is_success: is_success,
            with_marble: with_marble
          });
        } else {
          this.stock_result();
          break;
        }
      }
      return [this.results, true];
    };

    Simulator.prototype.stock_result = function() {
      return this.results.push([this.simulation_number, this.result_process.length - 1, this.used_scroll_num, this.used_money, this.result_process]);
    };

    return Simulator;

  })();

  with_scroll = false;

  Controller = (function() {
    function Controller() {}

    Controller.RANK = ['ur', 'sr', 'hr', 'r', 'hn', 'n'];

    Controller.initialize = function() {
      var from_oe, to_oe;
      from_oe = $('#plus').val();
      to_oe = $('#plus_target').val();
      $('span.result_plus').text(from_oe);
      $('span.result_plus_target').text(to_oe);
      Simulator.EXECUTE_COUNT_LIMIT = parseInt($('#execute_count').val());
      return this.results = [];
    };

    Controller.get_average_of_results = function(index, results) {
      var i, result, sum;
      sum = 0;
      for (i in results) {
        result = results[i];
        if (result) {
          sum += result[index];
        }
      }
      return sum / results.length;
    };

    Controller.copy_from_template = function(selector) {
      var $copied;
      $copied = $(selector).clone();
      $copied.attr('id', '');
      $copied.show();
      return $copied;
    };

    Controller.create_and_append_row = function(result) {
      var $tr1, $tr2, abbr_with_unit, abbr_with_unit_not_weapon, used_money_average;
      $tr1 = this.copy_from_template('#result_template_1');
      $tr2 = this.copy_from_template('#result_template_2');
      $('#result_table').append($tr1);
      $('#result_table').append($tr2);
      $tr1.find(".average_enhance_times").text(this.get_average_of_results(1, result).toFixed(0));
      $tr1.find(".average_used_scroll_num").text(this.get_average_of_results(2, result).toFixed(0));
      used_money_average = this.get_average_of_results(3, result);
      abbr_with_unit = this.abbr_with_unit(used_money_average);
      $tr1.find(".average_used_money").text(abbr_with_unit[0]);
      $tr1.find(".average_used_money_unit").text(abbr_with_unit[1]);
      abbr_with_unit_not_weapon = this.abbr_with_unit(used_money_average / 4);
      $tr2.find(".average_used_money_not_weapon").text(abbr_with_unit_not_weapon[0]);
      $tr2.find(".average_used_money_not_weapon_unit").text(abbr_with_unit_not_weapon[1]);
      return [$tr1, $tr2];
    };

    Controller.finalize = function() {
      var $tr1, $tr2, _results, active_rank, first, i, index, j, last, length_of_a_stage, luck, ref, result, results, stage, trs;
      this.results.sort(function(a, b) {
        return a[1] - b[1];
      });
      $('#result_table tr').not('#result_template_1, #result_template_2, #result_header, #result_title').detach();
      stage = 3;
      active_rank = this.RANK.slice(this.RANK.length - stage, this.RANK.length);
      _results = this.results.slice();
      results = {};
      length_of_a_stage = Math.floor(this.results.length / stage);
      for (i = j = 0, ref = stage; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        results[active_rank[i]] = _results.splice(0, length_of_a_stage);
      }
      for (index in active_rank) {
        luck = active_rank[index];
        result = results[luck];
        trs = this.create_and_append_row(result);
        $tr1 = trs[0];
        $tr1.find(".rarity").addClass(luck);
        $tr1.find(".rarity").text(luck.toUpperCase());
        first = this.results.indexOf(result[0]) + 1;
        last = this.results.indexOf(result[result.length - 1]) + 1;
        $tr1.find(".explain_rarity").text(first + "-" + last + "位");
      }
      trs = this.create_and_append_row(this.results);
      $tr1 = trs[0];
      $tr2 = trs[1];
      $tr1.find(".rarity").css('font-style', 'normal');
      $tr1.find(".rarity").text("全体");
      $tr1.find(".explain_rarity").text("計" + this.results.length + "回");
      $tr1.find("td").css({
        'border-top': 'solid white 2px',
        'font-weight': 'bold'
      });
      $tr1.css('margin-top', '2px');
      $tr2.find("td").css({
        'font-weight': 'bold'
      });
      $('.simulation_times').text(this.results.length);
      Simulator.execute_count = 0;
      if (this.is_not_first_rendering) {
        return this.highlight('table.rarity_6_stage_ver td');
      } else {
        return this.is_not_first_rendering = true;
      }
    };

    Controller.abbr_with_unit = function(money) {
      var money_divided_ichiman;
      money_divided_ichiman = money / 10000;
      if (money_divided_ichiman > 1) {
        return [money_divided_ichiman.toFixed(0), '万'];
      } else {
        return [(money / 1000).toFixed(0), '千'];
      }
    };

    Controller.highlight = function(selector) {
      $(selector).addClass('highlight');
      return setTimeout(function() {
        return $(selector).removeClass('highlight');
      }, 2000);
    };

    Controller.execute = function() {
      var i, is_continuable, j, ref, ret, sim, try_times;
      this.initialize();
      try_times = parseInt($('#simulation_type').val());
      $('th#result_details').toggle(this.show_details());
      i = 0;
      for (i = j = 1, ref = try_times; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        sim = new Simulator($('#plus').val(), i, try_times, parseInt($('#marble_count').val()));
        i++;
        ret = sim.exec(parseInt($('#plus_target').val()));
        is_continuable = ret[1];
        if (!is_continuable) {
          break;
        }
        this.results.push(ret[0][0]);
      }
      return this.finalize();
    };

    Controller.show_details = function() {
      return true;
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
    Controller.execute();
    return PopupWindow.init();
  });

}).call(this);
