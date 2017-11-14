;(function ($) {
   $.fn.Tabs = function (options) {
    //默认参数设置
    var settings = {
     beforeCss: "bcss", //激活前样式名
     afterCss: "acss", //激活后样式名
     model: "mouseover" //切换方式("mouseover"或者"click")
    };
 
    //不为空，则合并参数
    if (options)
     $.extend(settings, options);
 
    //获取a标签集合
    var arr_a = $("> dt > a", this);
 
    //给a标签分别绑定事件
    arr_a.each(function () {
     $(this).bind(settings.model, function (event) {
　　　　　　　　　　　　　　//去除a标签的锚点跳转
    　　　　 event.preventDefault();
      //样式控制
      $(this).removeClass().addClass(settings.afterCss)
      .siblings("a").removeClass().addClass(settings.beforeCss);
      //隐藏与显示控制
      var dd_id = $(this).attr("href");
      $(dd_id).show().siblings("dd").hide();
     });
    });
 
    //遵循链式原则
    return this.each(function () { });
   };
})(jQuery);