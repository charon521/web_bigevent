$.ajaxPrefilter(function (option) {
    option.url = 'http://ajax.frontend.itheima.net' + option.url;
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };
    //全局统一挂载 complete 函数
    // 不管成功还是失败都会调用 complete 回调函数
    option.complete = function (res) {
        // console.log(res);
        // 如果用户获取失败了 身份认证失败 就清除token 并强制返回到登录页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})