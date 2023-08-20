$(document).ready(function() {
  var canSendRequest = true; // 是否可以发送请求的标志

  $('#loginForm').on('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    // 获取用户输入的数据
    const username = $('#loginUsername').val();
    const password = $('#loginPassword').val();

    // 在此可以添加数据验证逻辑

    // 构造要发送给服务器的数据对象
    const dataToSend = { username, password };

    if (canSendRequest) {
      canSendRequest = false; // 禁止发送请求

      $.ajax({
        type: 'POST',
        url: 'https://ycl0.top/api/login', // 替换为实际的服务器URL
        data: dataToSend,
        dataType: 'json',
        success: function(response) {
          // 在成功回调中处理服务器返回的响应
          console.log('登录成功！服务器返回数据：', response);
          localStorage.setItem('username', username);
          const token = response.token;

          // 将令牌保存到本地存储
          localStorage.setItem('token', token);
        
          showMessage('success', response.message);
          // 一秒后允许发送下一个请求
          setTimeout(function() {
            canSendRequest = true;
          }, 1000);
        },
        error: function(xhr, status, error) {
          console.error('登录失败！错误信息：', xhr.responseJSON.message);
          // 进行错误处理
          showMessage('error',xhr.responseJSON.message);
          // 一秒后允许发送下一个请求
          setTimeout(function() {
            canSendRequest = true;
          }, 1000);
        }
      });
    } else {
      // 显示消息，提示用户稍后再试
      // showMessage('请稍后再试！');
    }

  });
});

// 显示消息并设置定时消失
function showMessage(type, message) {
    var messageContainer = $('#messageContainer');
    messageContainer.text(message);
    if (type === 'success') {
        messageContainer.css('background-color', 'green');
        setTimeout(function() {
            window.location.href = 'home.html';
         }, 2000);
    } else if (type === 'error') {
        messageContainer.css('background-color', 'red');
    }
    messageContainer.fadeIn().delay(1000).fadeOut(function () {
        $(this).text('').css('background-color', 'rgba(0, 0, 0, 0.8)'); // 清空消息内容并重置样式
    });
}