$(document).ready(function () {
    $('#forum').on('submit', function (event) {
        event.preventDefault();

        const keyWord = $('#keyWord').val();
        const content = $('#content').val();

        // 数据验证逻辑
        if (!keyWord) {
            showMessage('error', '请填写关键词');
            return;
        }

        if (!content) {
            showMessage('error', '请填写内容');
            return;
        }

        const dataToSend = {
            keyWord: keyWord,
            content: content,
        };

        $.ajax({
            type: 'POST',
            url: 'https://ycl0.top/api/forum',
            data: dataToSend,
            dataType: 'json',
            success: function (response) {
                console.log('服务器返回数据：', response);
                showMessage('success', response.message);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('错误信息：', jqXHR);
                showMessage('error', jqXHR.responseJSON.message);
            }
        });
    });
});

function showMessage(type, message) {
    var messageContainer = $('#messageContainer');
    messageContainer.text(message);
    if (type === 'success') {
        messageContainer.css('background-color', 'green');
    } else if (type === 'error') {
        messageContainer.css('background-color', 'red');
    }
    messageContainer.fadeIn().delay(1000).fadeOut(function () {
        $(this).text('').css('background-color', 'rgba(0, 0, 0, 0.8)');
    });
}
