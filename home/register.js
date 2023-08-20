$(document).ready(function () {
    $('#registerForm').on('submit', function (event) {
        event.preventDefault();
        const username = $('#registerUsername').val();
        const password = $('#registerPassword').val();

        const dataToSend = {
            username: username,
            password: password,
        };

        $.ajax({
            type: 'POST',
            url: 'https://ycl0.top/api/register',
            data: dataToSend,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    showMessage('success', response.message);
                } else {
                    showMessage('error', response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
                console.error('注册失败！错误信息：', jqXHR);
                showMessage('error',jqXHR.responseJSON.message);
            }
        });
    });
});

function showMessage(type, message) {
    var messageContainer = $('#messageContainer');
    messageContainer.text(message);
    if (type === 'success') {
        messageContainer.css('background-color', 'green');
        setTimeout(function() {
            window.location.href = 'login.html';
         }, 2000);
    } else if (type === 'error') {
        messageContainer.css('background-color', 'red');
    }
    messageContainer.fadeIn().delay(1000).fadeOut(function () {
        $(this).text('').css('background-color', 'rgba(0, 0, 0, 0.8)'); // 清空消息内容并重置样式
    });
}