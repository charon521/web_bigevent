function getUserInfo() {
    let token = localStorage.getItem('token');
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败!');
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(data) {
    let uname = data.nickname || data.username;
    $('#welcome').html('欢迎 ' + uname);
    if (data.user_pic) {
        $('.layui-nav-img').attr('src', data.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        $('.text-avatar').html(uname[0].toUpperCase()).show();
    }
}
$(function () {
    getUserInfo();

    $('#loginOut').on('click', function (e) {
        e.preventDefault();
        layui.layer.confirm('确认退出?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        });
    })
})