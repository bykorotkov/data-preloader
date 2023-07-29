(function ($) {
    // Объект для хранения текущего прелоадера
    var currentLoader = null;
    // Флаги для отслеживания закрытия и открытия прелоадера
    var isClosing = false;
    var isOpening = false;

    // Расширяем объект $.spgLoader
    $.spgLoader = {
        // Метод для показа прелоадера
        show: function (options) {
            var settings = $.extend(
                {
                    backgroundColor: "#000",
                    opacity: 0.7,
                    speedShow: 300,
                },
                options
            );

            // Если уже производится закрытие, отменяем его и показываем прелоадер заново
            if (isClosing) {
                currentLoader.stop().fadeIn(settings.speedShow);
                isClosing = false;
                return;
            }

            // Если уже есть открытый прелоадер, игнорируем повторный вызов
            if (isOpening) {
                return;
            }

            // Создаем новый прелоадер и показываем его
            var loader = $("<div>").addClass("spg-loader");
            loader.css({
                "background-color": settings.backgroundColor,
                opacity: settings.opacity,
            });

            var spinner = $("<div>").addClass("spg-spinner");
            loader.append(spinner);

            $("body").append(loader);
            loader.fadeIn(settings.speedShow, function () {
                isOpening = false;
            });

            // Сохраняем ссылку на текущий прелоадер и устанавливаем флаг открытия
            currentLoader = loader;
            isOpening = true;
        },

        // Метод для скрытия прелоадера
        hide: function (options) {
            var settings = $.extend(
                {
                    speedHide: 300,
                },
                options
            );

            // Если уже производится открытие, отменяем его и закрываем прелоадер заново
            if (isOpening) {
                currentLoader.stop().fadeOut(settings.speedHide, function () {
                    $(this).remove();
                    currentLoader = null;
                    isOpening = false;
                });
                return;
            }

            // Если уже закрывается, игнорируем повторный вызов
            if (isClosing) {
                return;
            }

            if (currentLoader) {
                currentLoader.fadeOut(settings.speedHide, function () {
                    $(this).remove();
                    currentLoader = null;
                    isClosing = false;
                });
            }
            isClosing = true;
        },
    };
})(jQuery);

$(function () {
    $("#button").click(function () {
        $.spgLoader.show({
            // Бэкграунд и опасити свойства можно убрать, так как стандартные значения заданы в плагине, но решил тут тоже оставить для большей гибкости
            backgroundColor: "#000",
            opacity: 0.7,
            speedShow: 300,
        });

        setTimeout(function () {
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
                    $.spgLoader.hide({
                        speedHide: 300,
                    });
                },
            });
        }, 3000);
    });
});
