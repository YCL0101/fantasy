$(document).ready(function () {
    // 解码 JWT 令牌中的过期时间字段&&登录验证
    // 判断令牌是否过期
    function isTokenExpired(token) {
        try {
            const decoded = jwt_decode(token);
            if (!decoded || !decoded.exp) {
                return true; // 如果无法解码或没有过期时间字段，认为已过期
            }

            const currentTime = Math.floor(Date.now() / 1000); // 当前时间（以秒为单位）
            return decoded.exp < currentTime;
        } catch (error) {
            console.log('解码出错');
            return true; // 解码出错，认为已过期
        }
    }

    const token = localStorage.getItem('token');
    console.log(token);
    const username = localStorage.getItem('username');
    const userLinks = $('#userLinks');
    const userLogin = $('#userLogin');
    const loggedInLinks = $('#loggedInLinks');
    const logoutLink = $('#logoutLink');


    if (token && !isTokenExpired(token)) {
        // 令牌有效，用户已登录
        userLinks.hide();
        loggedInLinks.show();
        userLogin.text('欢迎 ' + username).show();
    } else {
        userLinks.show();
        loggedInLinks.hide();
        console.log('令牌无效');
        // 令牌无效或已过期，用户需要重新登录
        // 执行重新登录操作
    }


    // 注销按钮点击事件
    logoutLink.on('click', function () {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        userLinks.show();
        loggedInLinks.hide();
    });
});



