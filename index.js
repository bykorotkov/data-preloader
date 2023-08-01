(function ($) {
    // Объект для хранения текущего прелоадера
    var currentLoader = null;
    // Флаг для отслеживания состояния прелоадера (открывается или закрывается)
    var isLoading = false;

    // Расширяем объект $.spgLoader
    $.spgLoader = {
        // Метод для показа прелоадера
        show: function (options) {
            var settings = $.extend(
                {
                    backgroundColor: "#000",
                    opacity: 0.7,
                    speed: 300,
                },
                options
            );

            // Если уже происходит закрытие, отменяем его и показываем прелоадер заново
            if (isLoading) {
                currentLoader.stop().fadeIn(settings.speed);
                isLoading = true;
                return;
            }

            // Если уже есть открытый прелоадер или анимация открытия запущена, игнорируем повторный вызов
            if (currentLoader || (currentLoader && currentLoader.data("isAnimated"))) {
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
            loader.fadeIn(settings.speed, function () {
                currentLoader.data("isAnimated", false);
            });

            // Сохраняем ссылку на текущий прелоадер и устанавливаем флаг открытия
            currentLoader = loader;
            isLoading = true;
        },

        // Метод для скрытия прелоадера
        hide: function (options) {
            var settings = $.extend(
                {
                    speed: 300,
                },
                options
            );

            // Если уже происходит открытие, отменяем его и закрываем прелоадер заново
            if (isLoading) {
                currentLoader.stop().fadeOut(settings.speed, function () {
                    $(this).remove();
                    currentLoader = null;
                    isLoading = false;
                });
                return;
            }

            // Если уже закрывается, игнорируем повторный вызов
            if (!currentLoader || (currentLoader && currentLoader.data("isAnimated"))) {
                return;
            }

            if (currentLoader) {
                currentLoader.fadeOut(settings.speed, function () {
                    $(this).remove();
                    currentLoader = null;
                    isLoading = false;
                });
            }
        },
    };
})(jQuery);

$(function () {
    $("#button").click(function () {
        $.spgLoader.show({
            // Бэкграунд и опасити свойства можно убрать, так как стандартные значения заданы в плагине, но решил тут тоже оставить для большей гибкости
            backgroundColor: "#000",
            opacity: 0.7,
            speed: 300,
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
                        speed: 300,
                    });
                },
            });
        }, 3000);
    });
});
