(function ($) {
    $.fn.spgLoader = function (options) {
        var settings = $.extend(
            {
                backgroundColor: "#fff",
                opacity: 0.5,
            },
            options
        );

        var loader = $("<div>").addClass("spg-loader");
        loader.css({
            "background-color": settings.backgroundColor,
            opacity: settings.opacity,
        });

        var spinner = $("<div>").addClass("spg-spinner");
        loader.append(spinner);

        this.append(loader);

        return {
            show: function () {
                loader.show();
                setTimeout(function () {
                    loader.hide();

                    $.ajax({
                        url: "https://jsonplaceholder.typicode.com/users",
                        method: "GET",
                        success: function (data) {
                            console.log(data);
                            // Можно обработать данные здесь и использовать их по своему усмотрению
                        },
                        error: function (error) {
                            console.log("Произошла ошибка при загрузке данных:", error);
                        },
                        complete: function () {
                            loader.hide();
                        },
                    });
                    console.log("Все супер, мы загрузили данные по юзерам");
                }, 3000);
            },
            hide: function () {
                loader.hide();
            },
        };
    };
})(jQuery);

$(function () {
    var loader = $("body").spgLoader({
        backgroundColor: "#000",
        opacity: 0.7,
    });

    $("#button").click(function () {
        loader.show();
    });
});
