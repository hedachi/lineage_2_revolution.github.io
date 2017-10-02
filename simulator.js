// Generated by CoffeeScript 1.12.7
(function() {
  var Simulator;

  Simulator = (function() {
    Simulator.log_count = 0;

    function Simulator(plus) {
      this.plus = plus;
    }

    Simulator.prototype.exec = function(scroll_num) {
      var before_plus, data, is_success, result, results, used_money, used_scroll_num;
      used_scroll_num = 0;
      used_money = 0;
      this.show_message("スクロール" + scroll_num + "枚で、武器+" + this.plus + "を強化します。");
      results = [];
      while (true) {
        data = this.constructor.get_data(this.plus);
        used_scroll_num += data.scroll;
        if (scroll_num - used_scroll_num >= 0) {
          used_money += data.money;
          before_plus = this.plus;
          is_success = (data.percent / 100) >= Math.random();
          if (is_success) {
            result = '成功';
            this.plus++;
          } else {
            result = '失敗';
            if (this.plus % 10 !== 0) {
              this.plus--;
            }
          }
          results.push(this.show_message("+" + before_plus + "からスクロール" + data.scroll + "枚、" + data.money + "アデナ、成功率" + data.percent + "%で強化...[" + result + "]" + this.plus + "になりました。"));
        } else {
          this.show_message("スクロールが足りなくなりました。累計消費アデナ:" + used_money);
          break;
        }
      }
      return results;
    };

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

    return Simulator;

  })();

  $(function() {
    $('#run').click(function() {
      var sim;
      sim = new Simulator($('#plus').val());
      return sim.exec($('#scroll_num').val());
    });
    return $('#plus').change(function() {
      if ($('#plus_target').val() <= $('#plus').val()) {
        return $('#plus_target').val(parseInt($('#plus').val()) + 1);
      }
    });
  });

}).call(this);
