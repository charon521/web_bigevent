$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
        $('input[name=username]').val('');
        $('input[name=password]').val('');
        $('input[name=repassword]').val('');
    });
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
        $('input[name=username]').val('');
        $('input[name=password]').val('');
    });

    // 表单验证
    var form = layui.form; //layui表单
    let layer = layui.layer; //layui弹出框
    // let url = 'http://ajax.frontend.itheima.net'; //接口根路径

    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格',
        ],
        // 检测两次密码是否输入一致
        repwd: function (value, item) {
            let pass = $('.reg-box input[name=password]').val();
            if (value !== pass) {
                return '两次密码不一致';
            }
        }
    });

    // 注册功能模块实现
    $('#form-reg').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        let data = {
            username: $('#form-reg input[name=username]').val(),
            password: $('#form-reg input[name=password]').val(),
        }
        // 发起 ajax 请求
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) return layer.msg(res.message);
            layer.msg('注册成功！');
            $('#link_login').click();
        })
    })

    // 登录功能模块实现
    $('#form-login').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起 ajax 请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // 获取token的值 存储到本地中
                localStorage.setItem('token', res.token);
                // 跳转到首页
                location.href = '/index.html';
            }
        })
    })
})