$(function () {
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
    getUserInfo();

    function renderAvatar(data) {
        let uname = data.username || data.nickname;
        $('#welcome').html('欢迎 ' + uname);
        console.log(data.user_pic);
        if (data.user_pic !== null) {
            $('.layui-nav-img').attr('src', data.user_pic).show();
            $('.text-avatar').hide();
        } else {
            $('.layui-nav-img').hide();
            $('.text-avatar').html(uname[0].toUpperCase()).show();
        }
    }

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